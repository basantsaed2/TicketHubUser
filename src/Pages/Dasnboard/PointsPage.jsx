import React, { useState, useEffect } from "react";
import { useGet } from "../../Hooks/useGet";
import StaticLoader from "../../Components/StaticLoader";

const PointsPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchPoints, loading: loadingPoints, data: pointsData } = useGet({
    url: `${apiUrl}/user/points`,
  });

  const [userData, setUserData] = useState({});
  const [points, setPoints] = useState([]);

  useEffect(() => {
    refetchPoints();
  }, [refetchPoints]);

  useEffect(() => {
    if (pointsData && pointsData.redeem_points && pointsData.user_data) {
      setUserData(pointsData.user_data);
      setPoints(pointsData.redeem_points);
    }
  }, [pointsData]);

  if (loadingPoints) {
    return <StaticLoader />;
  }

  return (
    <div className="w-full p-6">
      {/* Header Section */}
      <div className="bg-gray-900 text-white p-6 rounded-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={userData.profile_image || "https://via.placeholder.com/50"}
            alt={userData.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">{userData.name}</h2>
            <p className="text-sm">{userData.email}</p>
          </div>
        </div>
        <span className="text-lg font-semibold">{userData.points} Points</span>
      </div>

      {/* User Balance List */}
      <div className="mt-4 bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-lg font-semibold">User Balance</h3>
        {points.map((item, index) => (
          <div key={index} className="flex justify-between items-center border-b py-3">
            <div>
              <p className="text-md font-semibold">US Dollar</p>
              <p className="text-gray-500">US Dollar: ${item.amount}</p>
            </div>
            <button className="bg-orange-500 text-white px-3 py-1 rounded-md">Top up</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PointsPage;
