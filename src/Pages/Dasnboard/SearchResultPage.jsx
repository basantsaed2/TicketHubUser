import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import {FaBus,FaTrain,FaCar,FaStar,} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../Context/Auth';
import Error from './../../Assets/Images/Error.png'
// Helper function to calculate the time difference (assuming times are in "HH:MM:SS" format)
const getTimeDifference = (startTime, endTime) => {
  if (!startTime || !endTime) return "";
  const [sh, sm, ss] = startTime.split(":").map(Number);
  const [eh, em, es] = endTime.split(":").map(Number);
  const start = new Date(0, 0, 0, sh, sm, ss);
  const end = new Date(0, 0, 0, eh, em, es);
  let diff = end - start;
  if (diff < 0) diff += 24 * 60 * 60 * 1000; // handle midnight wrap
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return `${hours} hr${hours !== 1 ? "s" : ""} ${minutes} min${minutes !== 1 ? "s" : ""}`;
};

// Helper function to get an icon component based on trip type
const getServiceIcon = (tripType) => {
  switch (tripType) {
    case "bus":
      return <FaBus className="text-white text-4xl" />;
    case "train":
      return <FaTrain className="text-white text-4xl" />;
    case "hiace":
      return <FaCar className="text-white text-4xl" />;
    default:
      return null;
  }
};

const TripCard = ({ trip }) => {
  const busImage =
    trip.bus && trip.bus.image_link
      ? `${trip.bus.image_link}`
      : "https://via.placeholder.com/150x100?text=No+Image";

  // Use default values if rating or reviews are missing
  const rating = trip.rating || 4.5;
  const reviewsCount = trip.reviewsCount || 42;

  const departureTime = trip.deputre_time || "N/A";
  const arrivalTime = trip.arrival_time || "N/A";

  // Operator info: add label for bus number if available
  const operator =
    trip.bus && trip.bus.bus_number
      ? `Bus Number: ${trip.bus.bus_number}`
      : "Unknown Operator";

  const amenities = trip.bus?.aminity || [];
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-200">
      {/* Left Section: Image or Icon */}
      <div className="relative w-full md:w-40 h-32 md:h-full p-4 flex-shrink-0">
        {trip.bus && trip.bus.bus_image ? (
          <img src={busImage} alt="Service" className="w-full h-full object-cover rounded-md" />
        ) : (
          <div className="w-full h-full bg-mainColor flex items-center justify-center rounded-md">
            {getServiceIcon(trip.trip_type)}
          </div>
        )}
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-sm py-1 px-3">
          {trip.trip_name}
        </div>
      </div>

      {/* Middle Section: Trip Details */}
      <div className="flex-1 p-4">
        <div className="flex flex-row items-center gap-3 mb-2">
          <h2 className="text-xl font-semibold">{trip.trip_name}</h2>
          <div className="flex items-center text-yellow-500 text-sm">
            <FaStar className="mr-1" />
            <span>{rating}</span>
            <span className="ml-1 text-gray-500">({reviewsCount})</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-2">
          <div className="text-gray-700 text-md">
            <span className="font-medium">
              {trip.pickup_station?.name || "Unknown Pickup"}
            </span>
            <span className="mx-1 text-gray-400">→</span>
            <span className="font-medium">
              {trip.dropoff_station?.name || "Unknown Dropoff"}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            From: {departureTime}<span className="mx-1 text-gray-400">→</span> To :{arrivalTime} <br />
            ({getTimeDifference(departureTime, arrivalTime)})
          </div>
        </div>
          {/* <span className="text-gray-600">{trip.avalible_seats} seats left</span> */}
          <div className="flex items-center justify-between text-sm space-x-2">
            {amenities.map((amenity) => (
              <div
                key={amenity.id}
                className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
              >
                <img src={amenity.icon_link} alt={amenity.name} className="w-4 h-4 mr-1" />
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
      </div>

      {/* Right Section: Price & Action Button */}
      <div className="flex flex-col items-end justify-between p-4">
        <div className="flex flex-col items-end space-y-1">
        <span className="text-orange-500 font-semibold text-lg">
          Price: {trip.price}$ / Person
        </span>
        <span className="text-gray-600">{trip.avalible_seats} seats left</span>
        <span className="text-gray-600">{trip.trip_type} number :{trip.bus?.bus_number} </span>
        </div>
        <button
          onClick={() => {
            if (!auth.user) {
              auth.toastError('You must be logged in to continue.');
              navigate('/auth/login', { replace: true });
              return;
            }
            navigate(`details/${trip.id}`, { state: { trip } });
          }}
          className="w-full bg-mainColor hover:bg-mainColor/90 text-white font-semibold px-4 py-2 rounded"
        >
          Select
        </button>
      </div>
    </div>
  );
};

const SearchResultPage = () => {
  const { state } = useLocation();
  // Expected state: { trips: { all_trips: [...] }, service: "all" | "bus" | "train" | "hiace" }
  const { trips, service } = state || {};

  const filteredTrips = useMemo(() => {
    if (!trips || !trips.all_trips) return [];
    if (service === "all") return trips.all_trips;
    return trips.all_trips.filter((trip) => trip.trip_type === service);
  }, [trips, service]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Search Results</h1>
      <p className="text-center text-gray-600 mb-8">
        Service: <span className="font-semibold">{service ? service.toUpperCase() : "ALL"}</span>
      </p>

      {filteredTrips.length === 0 ? (
        <div className="flex flex-col justify-center items-center">
        <p className="text-center text-gray-700">
          No trips available for the selected service.
        </p>
        <img src={Error} alt="" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultPage;
