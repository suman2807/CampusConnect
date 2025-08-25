import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
// Remove the import and use the public URL directly
// import logo from "../../public/srmaplogo.png";
import { Link } from "react-router-dom";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Navbar() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-[#4d6b2c] px-6 py-4 text-white">
      <Link to="/">
        <img src="/srmaplogo.png" alt="SRM AP Logo" className="h-12 object-contain" />
      </Link>

      <button
        className="block md:hidden text-2xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <div
        className={`absolute top-16 left-0 w-full bg-[#4d6b2c] md:static md:flex md:items-center md:space-x-4 ${menuOpen ? "block" : "hidden"}`}
      >
        {isSignedIn && user ? (
          <div className="flex items-center space-x-4 p-4 md:p-0 md:ml-auto">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative">
              <div className="flex items-center">
                <img
                  src={user.imageUrl || user.profileImageUrl}
                  alt="Profile"
                  className="h-10 w-10 rounded-full cursor-pointer"
                />
                <ArrowDropDownIcon />
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48 p-2 z-10">
                  <Link to="/chat" className="block px-4 py-2 text-sm hover:bg-gray-200">
                    Live Chat
                  </Link>

                  <Link to="/" className="block px-4 py-2 text-sm hover:bg-gray-200">
                    Home
                  </Link>
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-200">
                    Your Profile
                  </Link>
                  <Link to="/about" className="block px-4 py-2 text-sm hover:bg-gray-200">
                    About Us
                  </Link>
                  
                </div>
              )}
            </button>
            <button
              onClick={handleSignOut}
              className="rounded bg-[#70703c] px-4 py-2 text-sm font-semibold hover:bg-[#5c5c31]"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="p-4 md:p-0 md:ml-auto">
            <Link
              to="/login"
              className="rounded bg-[#5e7b34] px-4 py-2 text-sm font-semibold hover:bg-[#49642a]"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;