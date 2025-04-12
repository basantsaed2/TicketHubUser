import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { usePost } from "../../Hooks/usePostJson";
import { useGet } from "../../Hooks/useGet";
import { FaWallet, FaCreditCard, FaPaypal } from "react-icons/fa";
import { useAuth } from '../../Context/Auth';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  // Expecting state: { trip: selectedTrip }
  const { trip } = state || {};
  const auth = useAuth();

  // Base API URL
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Payment endpoints
  const { postData:postPayment ,loadingPost:loadingBookWallet, response:responseBookWallet} = usePost({ url: `${apiUrl}/user/booking/payment` });
  const { postData:postPaymentWallet ,loadingPost, response} = usePost({ url: `${apiUrl}/user/booking/payment_wallet` });
  const { refetch: refetchBookingList, data: bookingListData } = useGet({ url:`${apiUrl}/user/booking/lists` });
  // Get available payment methods from API
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    refetchBookingList();
  }, [refetchBookingList]);

  useEffect(() => {
    if (bookingListData && bookingListData.payment_methods) {
      // Use API methods and add Wallet if not present.
      const methods = [...bookingListData.payment_methods];
      if (!methods.find((m) => m.id === "wallet")) {
        methods.unshift({
          id: "wallet",
          name: "Wallet",
          image: "https://via.placeholder.com/50?text=Wallet",
          icon: <FaWallet className="text-mainColor" />,
        });
      }
      setPaymentMethods(methods);
      setSelectedPaymentMethod(methods[0].id);
    }
  }, [bookingListData]);

  useEffect(() => {
    if((response && !loadingPost) || (responseBookWallet && !loadingBookWallet)){

    }
  }, [response]);

  // Payment Details Form Fields
  const [travelDate, setTravelDate] = useState(trip ? trip.date : "");
  const [receiptImage, setReceiptImage] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [travelerDetails, setTravelerDetails] = useState([{ name: "", age: "" }]);

  const today = new Date().toISOString().split("T")[0];

  // Toggle to show payment details form
  const [showForm, setShowForm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

   // Update the number of travelers and adjust travelerDetails accordingly
   const handleTravelersChange = (e) => {
    const value = Math.min(Math.max(e.target.value, 1), trip.avalible_seats); // Constrain to 1 and available_seats
    setTravelers(value);

    // Ensure travelerDetails has enough entries for the selected travelers
    const newDetails = Array.from({ length: value }, (_, i) => ({
      name: travelerDetails[i]?.name || "",
      age: travelerDetails[i]?.age || "",
    }));
    setTravelerDetails(newDetails);
  };

  // Handle changes for individual traveler details (name or age)
  const handleTravelerChange = (index, field, value) => {
    const updated = [...travelerDetails];
    updated[index][field] = value;
    setTravelerDetails(updated);
  };

  const handleReceiptChange = (e) => {
    setReceiptImage(e.target.files[0]);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!trip) {
        auth.toastError("No trip selected. Please go back and select a trip.");
      return;
    }
    if (!travelDate) {
        auth.toastError("Please enter the travel date.");
      return;
    }
    // Build form data
    const formData = new FormData();
    formData.append("trip_id", trip.id);
    formData.append("travelers", travelers);
    formData.append("amount", trip.price);
    formData.append("travel_date", travelDate);
    travelerDetails.forEach((traveler, index) => {
      formData.append(`travellers_data[${index}][name]`, traveler.name);
      formData.append(`travellers_data[${index}][age]`, traveler.age);
    });
    
    formData.append("receipt_image", receiptImage);
    if (selectedPaymentMethod === "wallet") {
      postPaymentWallet(formData ,"Payment submitted successfully!");
    } else {
      formData.append("payment_method_id", selectedPaymentMethod);
     postPayment(formData,"Payment submitted successfully!");
    }
  };

  useEffect(() => {
    if (!loadingPost && response) {
      setModalVisible(true);
      // navigate(-1); 
       }
  }, [loadingPost, response, navigate]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No trip selected. Please go back and select a trip.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Checkout</h1>

        <div className="w-full p-4">

          {/* Top Section: Trip Info & Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Trip Info Card */}
            <div className="bg-[#14142B] text-white rounded-lg p-4 text-sm space-y-3">
              <p className="font-semibold text-white text-2xl">Trip Info</p>
              <p className="font-medium text-lg">📍 Route: {trip.pickup_station?.name} → {trip.dropoff_station?.name}</p>
              <p className="text-lg">🎫 Trip Number: {trip.trip_number || "55841"}</p>
              <p className="text-lg">🕒 Departure: {trip.deputre_time}</p>
              <p className="text-lg">🕘 Arrival: {trip.arrival_time}</p>
              <p className="text-orange-400 font-semibold text-lg pt-3  border-t-2">💵 Price: ${trip.price} / Person</p>
            </div>

            {/* Payment Methods */}
            <div className="bg-[#F2F2F6] rounded-lg p-4 text-sm">
            <h3 className="text-xl font-semibold text-secoundColor mb-1">Payment Merthods</h3>
            <div className="flex flex-col gap-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer ${
                      selectedPaymentMethod === method.id
                        ? "border-orange-500 bg-orange-100"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => setSelectedPaymentMethod(method.id)}
                        className={`h-5 w-5 rounded-full appearance-none border-2 ${
                          selectedPaymentMethod === method.id
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300 bg-white"
                        }`}         />
                      <span className="text-lg">{method.name}</span>
                    </div>
                    <img src={method.image} alt={method.name} className="w-5 h-5 object-contain" />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Form Section */}
          <form onSubmit={handlePaymentSubmit} className="bg-white border border-gray-300 rounded-lg p-4 text-sm space-y-4">
          <h3 className="text-xl font-semibold text-secoundColor border-b pb-2">Payment Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">Travel Date</label>
              <Input
                type="date"
                value={travelDate}
                min={today}
                className="w-full border border-mainColor rounded-md focus:ring-mainColor"
              />
            </div> */}

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">Number of Travelers</label>
              <Input
                type="number"
                value={travelers}
                onChange={handleTravelersChange}
                min="1"
                max={trip.available_seats}
                className="w-full border border-mainColor rounded-md focus:ring-mainColor"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">Receipt Image</label>
              <Input
                type="file"
                onChange={handleReceiptChange}
                className="w-full border border-mainColor rounded-md focus:ring-mainColor"
              />
            </div>
          </div>

          {travelerDetails.map((traveler, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 rounded-md p-2 bg-gray-50 mt-2"
            >
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-medium mb-1">Traveler {index + 1} Name</label>
                <Input
                  type="text"
                  value={traveler.name}
                  onChange={(e) => handleTravelerChange(index, "name", e.target.value)}
                  className="w-full border border-mainColor rounded-md focus:ring-mainColor"
                  placeholder="Enter name"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-medium mb-1">Traveler {index + 1} Age</label>
                <Input
                  type="number"
                  value={traveler.age}
                  onChange={(e) => handleTravelerChange(index, "age", e.target.value)}
                  min="0"
                  className="w-full border border-mainColor rounded-md focus:ring-mainColor"
                  placeholder="Enter age"
                />
              </div>
            </div>
            ))}
          <div className="w-full flex items-center justify-center">
            <Button
              type="submit"
              className="text-lg  bg-mainColor border border-mainColor hover:bg-mainColor/90 text-white font-semibold py-6 rounded-md mt-4"
            >
              Confirm Payment
            </Button>
            </div>
          </form>

        </div>



      {/* Confirmation Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-mainColor mb-4">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-6">
              Your booking is under review. We will contact you soon.
            </p>
            <Button
              onClick={() => {
                setModalVisible(false);
                navigate(-1);
              }}
              className="bg-mainColor hover:bg-mainColor/90 text-white font-semibold py-2 rounded w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
