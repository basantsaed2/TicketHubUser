import React, { useState, useEffect } from "react";
import { useGet } from "../../../Hooks/useGet";
// React Icons
import { FaUserCircle, FaPhone, FaEnvelope, FaEdit, FaWallet, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";
const ProfilePage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // Fetch profile data from your API
  const { refetch: refetchProfile, data: profileData } = useGet({
    url: `${apiUrl}/user/profile`,
  });

  const [profile, setProfile] = useState({});

  useEffect(() => {
    refetchProfile();
  }, [refetchProfile]);

  useEffect(() => {
    if (profileData && profileData.user) {
      console.log("Profile Data:", profileData);
      setProfile(profileData.user);
    }
  }, [profileData]);

  // Fallback values if any fields are missing
  const userName = profile.name || "User Name";
  const userHandle = profile.username || "username";
  const userPoints = profile.points || 0;
  const userPhone = profile.phone || "No phone number";
  const userEmail = profile.email || "user@example.com";
  const userCountry = profile.country || "No country";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Top Header Card */}
      <div className="bg-gray-800 text-white rounded-xl p-6 flex items-center">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
          {/* If user has an avatar, replace FaUserCircle with an <img> tag */}
          <FaUserCircle className="text-4xl text-gray-300" />
        </div>
        {/* Name & Handle */}
        <div className="ml-4 flex-1">
          <h2 className="text-xl font-bold">{userName}</h2>
          <p className="text-sm text-gray-200">@{userHandle}</p>
        </div>
        {/* Points */}
        <div className="ml-auto text-right">
          <span className="text-xl font-bold">{userPoints}</span>
          <p className="text-sm">Points</p>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white rounded-xl shadow mt-6">
        <div className="p-4 space-y-4">
          {/* Phone */}
          <div className="flex items-center">
            <FaPhone className="text-mainColor mr-3" />
            <span className="text-gray-700">{userPhone}</span>
          </div>
          {/* Email */}
          <div className="flex items-center">
            <FaEnvelope className="text-mainColor mr-3" />
            <span className="text-gray-700">{userEmail}</span>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Action Items */}
        <div className="p-4 space-y-4">
          {/* Edit Profile */}
          <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded">
            <FaEdit className="text-mainColor mr-3" />
            <span className="text-gray-700 font-medium">Edit Profile</span>
          </div>

          {/* Wallet */}
          <Link to="/wallet" className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded">
            <FaWallet className="text-mainColor mr-3" />
            <span className="text-gray-700 font-medium">Wallet</span>
          </Link>

          {/* Country/Language */}
          <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded">
            <FaGlobe className="text-mainColor mr-3" />
            <span className="text-gray-700 font-medium">{userCountry}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
