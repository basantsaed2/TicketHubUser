import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { usePost } from "../../Hooks/usePostJson";
import { useGet } from "../../Hooks/useGet";
import { FaWallet, FaCreditCard, FaPaypal } from "react-icons/fa";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  // Expecting state: { trip: selectedTrip }
  const { trip } = state || {};

  // Base API URL
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Payment endpoints
  const { postData:postPayment ,loadingPost:loadingBookWallet, response:responseBookWallet} = usePost({ url: `${apiUrl}ظuser/booking/payment` });
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
  const [travelDate, setTravelDate] = useState("");
  const [receiptImage, setReceiptImage] = useState(null);
  const [travelers, setTravelers] = useState(trip ? trip.travelers || 1 : 1);
  const today = new Date().toISOString().split("T")[0];

  // Toggle to show payment details form
  const [showForm, setShowForm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
    formData.append("receipt_image", receiptImage);
    let res;
    if (selectedPaymentMethod === "wallet") {
      res = await postPaymentWallet(formData);
    } else {
      formData.append("payment_method_id", selectedPaymentMethod);
      res = await postPayment(formData);
    }
    if (res && (res.status === 200 || res.status === 201)) {
        setModalVisible(true);
      auth.toastSucess("Payment submitted successfully!");
      navigate(-1);
    } else {
    }auth.toastError('Payment submission failed. Please try again.')
  };

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

      {/* Trip Details Section */}
      <div className="bg-white rounded-xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-48 h-32 flex-shrink-0">
            <img
              src={
                trip.bus && trip.bus.bus_image
                  ? `${trip.bus.image_link}/${trip.bus.bus_image}`
                  : "https://via.placeholder.com/150x100?text=No+Image"
              }
              alt="Trip"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{trip.trip_name}</h2>
            <p className="text-gray-600 mt-1">
              {trip.pickup_station?.name} → {trip.dropoff_station?.name}
            </p>
            <p className="text-gray-600 mt-1">Departure: {trip.deputre_time}</p>
            <p className="text-gray-600 mt-1">Arrival: {trip.arrival_time}</p>
            <p className="text-orange-500 font-bold mt-3">
              Price: ${trip.price} / Person
            </p>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col lg:flex-row gap-6">
        {/* Payment Method Selection */}
        <div className="flex-1">
          <h2 className="text-2xl text-secoundColor font-bold mb-4">Payment Methods</h2>
          <div className="flex flex-col gap-4">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPaymentMethod === method.id
                    ? "border-mainColor bg-mainColor/10"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={() => setSelectedPaymentMethod(method.id)}
                  className="form-radio h-5 w-5 accent-mainColor"
                />
                <img
                  src={method.image}
                  alt={method.name}
                  className="w-12 h-12 object-cover rounded-full"
                />
                <span className="font-semibold text-lg">{method.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Details Form */}
        <div className="flex-1">
            <form onSubmit={handlePaymentSubmit} className="bg-white rounded-xl shadow-lg p-4 space-y-4">
              <h3 className="text-2xl font-bold text-secoundColor border-b pb-2">
                Payment Details
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col">
                  <label className="text-gray-700 text-md font-medium mb-1">Travel Date</label>
                  <Input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={today}
                    className="w-full border border-mainColor rounded-md border-mainColor focus:ring-mainColor"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 text-md font-medium mb-1">Number of Travelers</label>
                  <Input
                    type="number"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    min="1"
                    className="w-full rounded-md border border-mainColor border-mainColor focus:ring-mainColor"
                  />
                </div>
                <div className="flex flex-col">
                <label className="text-gray-700 text-md font-medium mb-1">Receipt Image</label>
                <Input
                    type="file"
                    onChange={handleReceiptChange}
                    className="w-full rounded-md border border border-mainColor focus:ring-mainColor"
                />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-mainColor border border-mainColor hover:bg-mainColor/90 text-white font-semibold py-2 rounded-md mt-3"
              >
                Confirm Payment
              </Button>
            </form>
        </div>
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
                navigate("/confirmation");
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
