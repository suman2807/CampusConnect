import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserShield, FaSpinner } from "react-icons/fa";
import { isUniversityEmail } from "../clerk";
import { userAPI } from "../api";

function Login() {
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Check if email is valid university email
      if (!isUniversityEmail(user.primaryEmailAddress?.emailAddress)) {
        alert("Please use your university email (@srmap.edu.in) to sign in.");
        return;
      }

      // Create or update user in our database
      const createUser = async () => {
        try {
          setIsCreatingUser(true);
          // Create or update user and redirect to home
          await userAPI.createOrUpdateUser({
            clerkId: user.id,
            email: user.primaryEmailAddress.emailAddress,
            fullName: user.fullName,
            profileImage: user.profileImageUrl
          });
          
          navigate("/");
        } catch (error) {
          console.error('Error creating/updating user:', error);
          navigate("/");
        } finally {
          setIsCreatingUser(false);
        }
      };

      createUser();
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      // Use Clerk's openSignIn modal for authentication
      await openSignIn({
        afterSignInUrl: '/',
        afterSignUpUrl: '/',
        appearance: {
          elements: {
            formButtonPrimary: {
              backgroundColor: '#5e7b34',
              '&:hover': {
                backgroundColor: '#49642a',
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error opening sign in modal:", error);
      alert("Unable to open sign-in. Please try again or check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  // Show loading screen while auth is loading or user is being created
  if (!isLoaded || isCreatingUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="University Logo"
              className="h-32 w-32 object-contain mb-4"
            />
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e7b34] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">
              {!isLoaded ? "Loading..." : "Setting up your account..."}
            </h2>
            <p className="text-gray-500 mt-2">
              {!isLoaded ? "Please wait while we load the application" : "This will only take a moment"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
        {/* University Image Section */}
        <div className="flex justify-center">
          <img
            src="/logo.png" // Replace with your university logo URL
            alt="University Logo"
            className="h-32 w-32 object-contain mb-4"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Login</h1>

        {/* Student Login Button */}
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-3 rounded-lg px-4 py-3 text-white text-lg font-semibold transition duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#5e7b34] hover:bg-[#49642a]"
          }`}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaUser />
          )}
          {isLoading ? "Opening Sign In..." : "Student Login"}
        </button>

        {/* Admin Login Button */}
        <button
          onClick={handleAdminLogin}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-3 rounded-lg px-4 py-3 text-white text-lg font-semibold transition duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#5e7b34] hover:bg-[#49642a]"
          }`}
        >
          <FaUserShield />
          Admin Login
        </button>
      </div>
    </div>
  );
}

export default Login;