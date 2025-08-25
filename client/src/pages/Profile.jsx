import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const Profile = () => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn || !user) {
    // Show a fallback if the user isn't logged in
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0] text-black">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-white">
      {/* Profile Details */}
      <div className="max-w-md mx-auto mt-10 p-6 bg-[#4d6b2c] rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <img
            src={user.imageUrl || "https://via.placeholder.com/100?text=Profile"} // Fallback for missing photo
            alt="Profile"
            className="h-24 w-24 rounded-full bg-gray-200"
          />
        </div>
        <h1 className="text-lg font-bold">{user.fullName || "Anonymous User"}</h1>
        <p className="text-sm flex items-center justify-center gap-2 mt-2">
          <span role="img" aria-label="email">
            📧
          </span>
          {user.primaryEmailAddress?.emailAddress || "No Email Provided"}
        </p>
        {user.primaryPhoneNumber && (
          <p className="text-sm flex items-center justify-center gap-2 mt-2">
            <span role="img" aria-label="phone">
              📱
            </span>
            {user.primaryPhoneNumber}
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;
