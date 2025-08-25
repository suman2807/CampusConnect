import { useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { isUniversityEmail } from "../clerk";
import { userAPI } from "../api";

function Login() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (isSignedIn && user) {
      // Check if email is valid university email
      if (!isUniversityEmail(user.primaryEmailAddress?.emailAddress)) {
        alert("Please use your university email (@srmap.edu.in) to sign in.");
        return;
      }

      // Create or update user in our database
      const createUser = async () => {
        try {
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
        }
      };

      createUser();
    }
  }, [isSignedIn, user, navigate]);

  const handleSignIn = async () => {
    try {
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
    }
  };

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
          className="w-full flex items-center justify-center gap-3 rounded-lg bg-[#5e7b34] px-4 py-3 text-white text-lg font-semibold hover:bg-[#49642a] transition duration-300"
        >
          <FaUser className="text-white" />
          Student Login
        </button>
      </div>
    </div>
  );
}

export default Login;