import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaClock, FaChair, FaMoneyBillAlt } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import bgTrip from "../../Assets/Images/bgTrip.jpg"; // Make sure the path is correct

// Utility to calculate time difference
const getDuration = (start, end) => {
  if (!start || !end) return "N/A";
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);
  let startMinutes = h1 * 60 + m1;
  let endMinutes = h2 * 60 + m2;
  if (endMinutes < startMinutes) endMinutes += 24 * 60; // handle overnight trips
  const total = endMinutes - startMinutes;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
};

const TripDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const trip = state.trip;

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Optional top image */}
      {/* <div className="w-full p-12 h-[400px] overflow-hidden relative">
        <img
          src={bgTrip}
          alt="Trip"
          className="w-full h-full object-cover object-center"
        />
      </div> */}

<div className="w-full px-6 py-10 bg-gradient-to-br from-orange-50 via-white to-white">
  {/* Header */}
  <div className="mb-8 text-center">
    <h1 className="text-4xl font-bold text-orange-600 capitalize tracking-tight">
      {trip.trip_name}
    </h1>
    <p className="text-md text-gray-500 mt-1">Trip Type: {trip.trip_type}</p>
  </div>

  {/* Main Card */}
  <div className="w-full mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-10 border border-orange-100">
    {/* Date */}
    <InfoBlock label="Date" value={trip.date} />

    {/* Stations (From → To) */}
    <div className="flex items-center gap-6  p-6 rounded-xl border border-orange-100 shadow-sm">
      <div className="flex flex-col items-center text-center flex-1">
        <p className="text-sm text-gray-500">From</p>
        <div className="text-lg font-semibold text-gray-800">
          {trip.pickup_station?.name}
        </div>
      </div>
      <div className="text-3xl text-orange-500">⟶</div>
      <div className="flex flex-col items-center text-center flex-1">
        <p className="text-sm text-gray-500">To</p>
        <div className="text-lg font-semibold text-gray-800">
          {trip.dropoff_station?.name}
        </div>
      </div>
    </div>

    {/* Time Info */}
    <div className="grid md:grid-cols-3 gap-6 text-center">
      <InfoBlock
        label="Departure Time"
        value={trip.deputre_time|| "N/A"}
        icon={<FaClock />}
      />
      <InfoBlock
        label="Arrival Time"
        value={trip.arrival_time || "N/A"}
        icon={<FaClock />}
      />
      <InfoBlock
        label="Duration"
        value={getDuration(trip.deputre_time, trip.arrival_time)}
        icon={<FaClock />}
      />
    </div>

    {/* Price / Seats / Fees */}
    <div className="grid md:grid-cols-3 gap-6">
      <InfoBlock
        label="Available Seats"
        value={trip.avalible_seats}
        icon={<FaChair />}
      />
      <InfoBlock
        label="Price"
        value={`${trip.price} ${trip.currency?.symbol}`}
        icon={<FaMoneyBillAlt />}
      />
      <InfoBlock
        label="Service Fees"
        value={`${trip.service_fees} ${trip.currency?.symbol}`}
      />
    </div>

    {/* Cancellation Policy */}
    <div className="bg-gray-50 border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <MdOutlineCancel className="text-orange-500 text-xl" />
        Cancellation Policy
      </h2>
      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
        <li>Allowed up to {trip.cancelation_hours} hours before departure</li>
        <li>
          Penalty: {trip.cancelation_pay_value} ({trip.cancelation_pay_amount})
        </li>
        <li className="capitalize">{trip.cancellation_policy}</li>
      </ul>
    </div>

    {/* CTA Button */}
    <div className="flex justify-center pt-4">
      <button
        onClick={() => navigate("/checkout", { state: { trip } })}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-md transition"
      >
        Continue To Checkout
      </button>
    </div>
  </div>
</div>

    </div>
  );
};

// Reusable Info Block component
const InfoBlock = ({ label, value, icon }) => (
  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border shadow-sm">
    {icon && <div className="text-orange-500 mt-1 text-lg">{icon}</div>}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);

export default TripDetailsPage;
