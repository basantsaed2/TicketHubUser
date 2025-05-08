// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Input } from "@/Components/ui/input";
// import { Button } from "@/Components/ui/button";
// import { usePost } from "../../Hooks/usePostJson";
// import { useGet } from "../../Hooks/useGet";
// import { FaWallet, FaCreditCard, FaPaypal } from "react-icons/fa";
// import { useAuth } from '../../Context/Auth';

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   // Expecting state: { trip: selectedTrip }
//   const { trip } = state || {};
//   const auth = useAuth();
// console.log("TRip",trip)
//   // Base API URL
//   const apiUrl = import.meta.env.VITE_API_BASE_URL;

//   // Payment endpoints
//   const { postData:postPayment ,loadingPost:loadingBookWallet, response:responseBookWallet} = usePost({ url: `${apiUrl}/user/booking/payment` });
//   const { postData:postPaymentWallet ,loadingPost, response} = usePost({ url: `${apiUrl}/user/booking/payment_wallet` });
//   const { refetch: refetchBookingList, data: bookingListData } = useGet({ url:`${apiUrl}/user/booking/lists` });
//   // Get available payment methods from API
//   const [paymentMethods, setPaymentMethods] = useState([]);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

//   useEffect(() => {
//     refetchBookingList();
//   }, [refetchBookingList]);

//   useEffect(() => {
//     if (bookingListData && bookingListData.payment_methods) {
//       // Use API methods and add Wallet if not present.
//       const methods = [...bookingListData.payment_methods];
//       if (!methods.find((m) => m.id === "wallet")) {
//         methods.unshift({
//           id: "wallet",
//           name: "Wallet",
//           image: "https://via.placeholder.com/50?text=Wallet",
//           icon: <FaWallet className="text-mainColor" />,
//         });
//       }
//       setPaymentMethods(methods);
//       setSelectedPaymentMethod(methods[0].id);
//     }
//   }, [bookingListData]);

//   useEffect(() => {
//     if((response && !loadingPost) || (responseBookWallet && !loadingBookWallet)){

//     }
//   }, [response]);

//   // Payment Details Form Fields
//   const [travelDate, setTravelDate] = useState(trip ? trip.date : "");
//   const [receiptImage, setReceiptImage] = useState(null);
//   const [travelers, setTravelers] = useState(1);
//   const [travelerDetails, setTravelerDetails] = useState([{ name: "", age: "" }]);

//   const today = new Date().toISOString().split("T")[0];

//   // Toggle to show payment details form
//   const [showForm, setShowForm] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);

//    // Update the number of travelers and adjust travelerDetails accordingly
//    const handleTravelersChange = (e) => {
//     const value = Math.min(Math.max(e.target.value, 1), trip.avalible_seats); // Constrain to 1 and available_seats
//     setTravelers(value);

//     // Ensure travelerDetails has enough entries for the selected travelers
//     const newDetails = Array.from({ length: value }, (_, i) => ({
//       name: travelerDetails[i]?.name || "",
//       age: travelerDetails[i]?.age || "",
//     }));
//     setTravelerDetails(newDetails);
//   };

//   // Handle changes for individual traveler details (name or age)
//   const handleTravelerChange = (index, field, value) => {
//     const updated = [...travelerDetails];
//     updated[index][field] = value;
//     setTravelerDetails(updated);
//   };

//   const handleReceiptChange = (e) => {
//     setReceiptImage(e.target.files[0]);
//   };

//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();
//     if (!trip) {
//         auth.toastError("No trip selected. Please go back and select a trip.");
//       return;
//     }
//     if (!travelDate) {
//         auth.toastError("Please enter the travel date.");
//       return;
//     }
//     // Build form data
//     const formData = new FormData();
//     formData.append("trip_id", trip.id);
//     formData.append("travelers", travelers);
//     formData.append("amount", trip.price);
//     formData.append("travel_date", travelDate);
//     travelerDetails.forEach((traveler, index) => {
//       formData.append(`travellers_data[${index}][name]`, traveler.name);
//       formData.append(`travellers_data[${index}][age]`, traveler.age);
//     });
    
//     formData.append("receipt_image", receiptImage);
//     if (selectedPaymentMethod === "wallet") {
//       postPaymentWallet(formData ,"Payment submitted successfully!");
//     } else {
//       formData.append("payment_method_id", selectedPaymentMethod);
//      postPayment(formData,"Payment submitted successfully!");
//     }
//   };

//   useEffect(() => {
//     if (!loadingPost && response) {
//       setModalVisible(true);
//       // navigate("/"); 
//        }
//   }, [loadingPost, response, navigate]);

//   if (!trip) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>No trip selected. Please go back and select a trip.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
//       <h1 className="text-3xl font-bold text-center">Checkout</h1>

//         <div className="w-full p-4">

//           {/* Top Section: Trip Info & Payment Methods */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
//             {/* Trip Info Card */}
//             <div className="bg-[#14142B] text-white rounded-lg p-4 text-sm space-y-3">
//               <p className="font-semibold text-white text-2xl">Trip Info</p>
//               <p className="font-medium text-lg">📍 Route: {trip.pickup_station?.name} → {trip.dropoff_station?.name}</p>
//               <p className="text-lg">🎫 Trip Number: {trip.trip_number || "55841"}</p>
//               <p className="text-lg">🕒 Departure: {trip.deputre_time}</p>
//               <p className="text-lg">🕘 Arrival: {trip.arrival_time}</p>
//               <p className="text-orange-400 font-semibold text-lg pt-3  border-t-2">💵 Price: ${trip.price} / Person</p>
//             </div>

//             {/* Payment Methods */}
//             <div className="bg-[#F2F2F6] rounded-lg p-4 text-sm">
//             <h3 className="text-xl font-semibold text-secoundColor mb-1">Payment Merthods</h3>
//             <div className="flex flex-col gap-2">
//                 {paymentMethods.map((method) => (
//                   <label
//                     key={method.id}
//                     className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer ${
//                       selectedPaymentMethod === method.id
//                         ? "border-orange-500 bg-orange-100"
//                         : "bg-white"
//                     }`}
//                   >
//                     <div className="flex items-center gap-2">
//                     <input
//                         type="radio"
//                         name="paymentMethod"
//                         value={method.id}
//                         checked={selectedPaymentMethod === method.id}
//                         onChange={() => setSelectedPaymentMethod(method.id)}
//                         className={`h-5 w-5 rounded-full appearance-none border-2 ${
//                           selectedPaymentMethod === method.id
//                             ? "border-orange-500 bg-orange-500"
//                             : "border-gray-300 bg-white"
//                         }`}         />
//                       <span className="text-lg">{method.name}</span>
//                     </div>
//                     <div className="w-12 h-14  rounded">
//                     <img src={method.image_link} alt={method.name} className="w-full h-full object-contain rounded" />
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Compact Form Section */}
//           <form onSubmit={handlePaymentSubmit} className="bg-white border border-gray-300 rounded-lg p-4 text-sm space-y-4">
//           <h3 className="text-xl font-semibold text-secoundColor border-b pb-2">Payment Details</h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {/* <div className="flex flex-col">
//               <label className="text-gray-700 text-sm font-medium mb-1">Travel Date</label>
//               <Input
//                 type="date"
//                 value={travelDate}
//                 min={today}
//                 className="w-full border border-mainColor rounded-md focus:ring-mainColor"
//               />
//             </div> */}

//             <div className="flex flex-col">
//               <label className="text-gray-700 text-sm font-medium mb-1">Number of Travelers</label>
//               <Input
//                 type="number"
//                 value={travelers}
//                 onChange={handleTravelersChange}
//                 min="1"
//                 max={trip.available_seats}
//                 className="w-full border border-mainColor rounded-md focus:ring-mainColor"
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="text-gray-700 text-sm font-medium mb-1">Receipt Image</label>
//               <Input
//                 type="file"
//                 onChange={handleReceiptChange}
//                 className="w-full border border-mainColor rounded-md focus:ring-mainColor"
//               />
//             </div>
//           </div>

//           {travelerDetails.map((traveler, index) => (
//             <div
//               key={index}
//               className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 rounded-md p-2 bg-gray-50 mt-2"
//             >
//               <div className="flex flex-col">
//                 <label className="text-gray-700 text-sm font-medium mb-1">Traveler {index + 1} Name</label>
//                 <Input
//                   type="text"
//                   value={traveler.name}
//                   onChange={(e) => handleTravelerChange(index, "name", e.target.value)}
//                   className="w-full border border-mainColor rounded-md focus:ring-mainColor"
//                   placeholder="Enter name"
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-gray-700 text-sm font-medium mb-1">Traveler {index + 1} Age</label>
//                 <Input
//                   type="number"
//                   value={traveler.age}
//                   onChange={(e) => handleTravelerChange(index, "age", e.target.value)}
//                   min="0"
//                   className="w-full border border-mainColor rounded-md focus:ring-mainColor"
//                   placeholder="Enter age"
//                 />
//               </div>
//             </div>
//             ))}
//           <div className="w-full flex items-center justify-center">
//             <Button
//               type="submit"
//               className="text-lg  bg-mainColor border border-mainColor hover:bg-mainColor/90 text-white font-semibold py-6 rounded-md mt-4"
//             >
//               Confirm Payment
//             </Button>
//             </div>
//           </form>

//         </div>



//       {/* Confirmation Modal */}
//       {modalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
//             <h2 className="text-2xl font-bold text-mainColor mb-4">
//               Thank You!
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Your booking is under review. We will contact you soon.
//             </p>
//             <Button
//               onClick={() => {
//                 setModalVisible(false);
//                 navigate(-1);
//               }}
//               className="bg-mainColor hover:bg-mainColor/90 text-white font-semibold py-2 rounded w-full"
//             >
//               Close
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { usePost } from "../../Hooks/usePostJson";
import { useGet } from "../../Hooks/useGet";
import { FaWallet, FaCreditCard, FaPaypal, FaChair, FaUserAlt, FaBus } from "react-icons/fa";
import { IoMdClose, IoIosArrowForward } from "react-icons/io";
import { useAuth } from '../../Context/Auth';

const SeatSelection = ({ trip, travelers, onSeatsSelected, selectedSeats }) => {
  const isSeatAvailable = (seatNumber) => {
    return trip.bus?.new_areas?.[seatNumber] === true;
  };

  const toggleSeatSelection = (seatNumber) => {
    if (!isSeatAvailable(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      onSeatsSelected(selectedSeats.filter(s => s !== seatNumber));
    } else if (selectedSeats.length < travelers) {
      onSeatsSelected([...selectedSeats, seatNumber]);
    }
  };

  const renderBusLayout = () => {
    // Define the seat layout for bus/Hiace
    const seatLayout = [
      // First row (driver + passenger)
      [
        { type: 'driver' }, 
        { number: 1, row: 1, col: 2 },
        { number: 2, row: 1, col: 3 }
      ],
      // Second row (4 seats)
      [
        { number: 3, row: 2, col: 1 },
        { number: 4, row: 2, col: 2 },
        { number: 5, row: 2, col: 3 },
        { number: 6, row: 2, col: 4 }
      ],
      // Third row (4 seats)
      [
        { number: 7, row: 3, col: 1 },
        { number: 8, row: 3, col: 2 },
        { number: 9, row: 3, col: 3 },
        { number: 10, row: 3, col: 4 }
      ],
      // Fourth row (4 seats)
      [
        { number: 11, row: 4, col: 1 },
        { number: 12, row: 4, col: 2 },
        { number: 13, row: 4, col: 3 },
        { number: 14, row: 4, col: 4 }
      ]
    ];

    return (
      <div className="relative bg-gray-50 p-2 sm:p-4 md:p-6 rounded-xl border border-gray-200">
        {/* Bus outline */}
        <div className="absolute inset-0 border-2 sm:border-4 border-gray-200 rounded-xl opacity-10 pointer-events-none"></div>
        
        {/* Driver position */}
        <div className="absolute left-1/2 top-2 sm:top-4 transform -translate-x-1/2 flex flex-col items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center mb-1">
            <FaUserAlt className="text-gray-600 text-sm sm:text-base md:text-lg" />
          </div>
          <span className="text-xs font-medium text-gray-500">Driver</span>
        </div>

        {/* Seats grid */}
        <div className="grid grid-rows-4 gap-2 sm:gap-4 md:gap-6 mt-12 sm:mt-16">
          {seatLayout.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-4">
              {row.map((seat) => {
                if (seat.type === 'driver') {
                  return <div key="driver" className="flex items-center justify-center"></div>;
                }

                const isAvailable = isSeatAvailable(seat.number);
                const isSelected = selectedSeats.includes(seat.number);
                
                return (
                  <div 
                    key={`seat-${seat.number}`} 
                    className={`flex items-center justify-center ${
                      seat.col === 1 ? 'mr-2 sm:mr-4 md:mr-8' : 
                      seat.col === 4 ? 'ml-2 sm:ml-4 md:ml-8' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSeatSelection(seat.number)}
                      disabled={!isAvailable}
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-md sm:rounded-lg border-2 transition-all transform hover:scale-105
                        ${isSelected ? 'bg-orange-500 border-orange-600 text-white shadow-md' : 
                          isAvailable ? 'bg-white border-gray-300 hover:border-orange-400' : 
                          'bg-gray-200 border-gray-300 cursor-not-allowed'}`}
                    >
                      {isAvailable ? (
                        <>
                          <span className="font-medium text-xs sm:text-sm md:text-base">{seat.number}</span>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-[8px] sm:text-xs">
                              ✓
                            </div>
                          )}
                        </>
                      ) : (
                        <IoMdClose className="text-gray-400 text-sm sm:text-base" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Aisle markers */}
        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 h-3/5 w-0.5 sm:w-1 bg-gray-300 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 h-3/5 w-0.5 sm:w-1 bg-gray-300 rounded-full opacity-20"></div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Select Your Seats</h2>
        <div className="bg-orange-100 text-orange-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-medium text-sm sm:text-base">
          {selectedSeats.length} of {travelers} selected
        </div>
      </div>
      
      {renderBusLayout()}

      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6 sm:mt-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-sm shadow"></div>
          <span className="text-gray-700 font-medium text-sm sm:text-base">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white border-2 border-gray-300 rounded-sm"></div>
          <span className="text-gray-700 font-medium text-sm sm:text-base">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 border-2 border-gray-300 rounded-sm"></div>
          <span className="text-gray-700 font-medium text-sm sm:text-base">Unavailable</span>
        </div>
      </div>
    </div>
  );
};
const TravelerInfoCard = ({ index, traveler, onChange, seatNumber }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Traveler {index + 1}</h3>
        {seatNumber && (
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <FaChair className="mr-1" /> Seat {seatNumber}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
          <Input
            type="text"
            value={traveler.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            className="w-full border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">Age</label>
          <Input
            type="number"
            value={traveler.age}
            onChange={(e) => onChange(index, "age", e.target.value)}
            min="1"
            max="120"
            className="w-full border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter age"
            required
          />
        </div>
      </div>
    </div>
  );
};

const PaymentMethodCard = ({ method, selected, onChange }) => {
  return (
    <div
      onClick={() => onChange(method.id)}
      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
        selected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${selected ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"}`}>
          {method.icon || <FaCreditCard className="text-xl" />}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{method.name}</h3>
          {method.id === "wallet" && (
            <p className="text-sm text-gray-500">Balance: {method.balance || 0}</p>
          )}
        </div>
        <div className="ml-auto">
          <IoIosArrowForward className={`text-xl ${selected ? "text-orange-500" : "text-gray-400"}`} />
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { trip } = state || {};
  console.log("Trip",trip)
  const auth = useAuth();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData: postPayment, loadingPost: loadingBookWallet, response: responseBookWallet } = usePost({ url: `${apiUrl}/user/booking/payment` });
  const { postData: postPaymentWallet, loadingPost, response } = usePost({ url: `${apiUrl}/user/booking/payment_wallet` });
  const { refetch: refetchBookingList, data: bookingListData } = useGet({ url: `${apiUrl}/user/booking/lists` });
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [travelDate] = useState(trip ? trip.date : "");
  const [receiptImage, setReceiptImage] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [travelerDetails, setTravelerDetails] = useState([{ name: "", age: "" }]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    refetchBookingList();
  }, [refetchBookingList]);

  useEffect(() => {
    if (bookingListData?.payment_methods) {
      const methods = bookingListData.payment_methods.map(m => ({
        ...m,
        icon: <FaCreditCard className="text-mainColor" />
      }));
      
      if (!methods.find(m => m.id === "wallet")) {
        methods.unshift({
          id: "wallet",
          name: "Wallet",
          image: "https://via.placeholder.com/50?text=Wallet",
          icon: <FaWallet className="text-mainColor" />,
          balance: auth.user?.wallet_balance
        });
      }
      
      setPaymentMethods(methods);
      setSelectedPaymentMethod(methods[0]?.id || "");
    }
  }, [bookingListData]);

  useEffect(() => {
    if ((response && !loadingPost) || (responseBookWallet && !loadingBookWallet)) {
      console.log("response",response)
      if (responseBookWallet.data && responseBookWallet.data?.paymentLink){
        window.open(responseBookWallet.data?.paymentLink, '_blank');
      }else{
        setModalVisible(true);
      }
    }
  }, [response, loadingPost, responseBookWallet, loadingBookWallet]);

  const handleTravelersChange = (e) => {
    const newTravelers = Math.min(Math.max(parseInt(e.target.value) || 1, 1), trip.avalible_seats);
    setTravelers(newTravelers);
    
    // Reset traveler details
    setTravelerDetails(Array.from({ length: newTravelers }, (_, i) => ({
      name: travelerDetails[i]?.name || "",
      age: travelerDetails[i]?.age || "",
    })));
    
    // Remove excess seats if decreasing travelers
    if (newTravelers < selectedSeats.length) {
      setSelectedSeats(selectedSeats.slice(0, newTravelers));
    }
  };

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
    
    // Convert selectedSeats to array if it isn't already
    const seatsArray = Array.isArray(selectedSeats) ? selectedSeats : 
                      typeof selectedSeats === 'string' ? selectedSeats.split(',').map(Number) : 
                      [];
  
    // Validate seat count matches travelers
    if (seatsArray.length !== travelers) {
      auth.toastError(`Please select exactly ${travelers} seat(s)`);
      return;
    }
  
    const formData = new FormData();
    formData.append("trip_id", trip.id);
    formData.append("travelers", travelers);
    formData.append("amount", trip.price * travelers);
    formData.append("travel_date", travelDate);
    
    // Append each seat individually with index
    seatsArray.forEach((seat, index) => {
      formData.append(`seats[${index}]`, seat);
    });
  
    // Append traveler details (your existing code)
    travelerDetails.forEach((traveler, index) => {
      formData.append(`travellers_data[${index}][name]`, traveler.name);
      formData.append(`travellers_data[${index}][age]`, traveler.age);
    });
    
    if (receiptImage) {
      formData.append("receipt_image", receiptImage);
    }
  
    if (selectedPaymentMethod === "wallet") {
      await postPaymentWallet(formData, "Payment submitted successfully!");
    } else {
      formData.append("payment_method_id", selectedPaymentMethod);
      await postPayment(formData, "Payment submitted successfully!");
    }
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Trip Selected</h2>
          <p className="text-gray-600 mb-6">Please go back and select a trip to continue.</p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = (trip.price * travelers) + trip.service_fees;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium">
            <FaBus className="inline mr-2" />
            {trip.trip_name}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Trip summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip summary card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-5 text-white">
                <h2 className="text-xl font-bold">Trip Details</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Route</h3>
                    <p className="text-gray-600">{trip.pickup_station?.name} → {trip.dropoff_station?.name}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {trip.trip_type === 'bus' ? 'Bus' : 'Hiace'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Departure</h3>
                    <p className="text-gray-600">{new Date(trip.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-gray-600">{trip.deputre_time}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Arrival</h3>
                    <p className="text-gray-600">{trip.arrival_time}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Price per seat</span>
                    <span className="font-semibold">{trip.price} {trip.currency?.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-gray-700">Service fee</span>
                    <span className="font-semibold">{trip.service_fees} {trip.currency?.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <span className="font-bold text-lg text-gray-800">Total</span>
                    <span className="font-bold text-xl text-orange-600">{totalPrice.toFixed(2)} {trip.currency?.symbol}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat selection */}
            <SeatSelection 
              trip={trip}
              travelers={travelers}
              onSeatsSelected={setSelectedSeats}
              selectedSeats={selectedSeats}
            />

            {/* Traveler information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Traveler Information</h2>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">Number of Travelers</label>
                <Input
                  type="number"
                  value={travelers}
                  onChange={handleTravelersChange}
                  min="1"
                  max={trip.avalible_seats}
                  className="w-full max-w-xs border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {travelerDetails.map((traveler, index) => (
                <TravelerInfoCard
                  key={index}
                  index={index}
                  traveler={traveler}
                  onChange={handleTravelerChange}
                  seatNumber={selectedSeats[index]}
                />
              ))}

              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-3">Receipt Image (Optional)</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition">
                      <span className="text-gray-600">Click to upload receipt</span>
                      <input
                        type="file"
                        onChange={handleReceiptChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </label>
                  {receiptImage && (
                    <span className="text-sm text-gray-600">{receiptImage.name}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Payment */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    selected={selectedPaymentMethod === method.id}
                    onChange={setSelectedPaymentMethod}
                  />
                ))}
              </div>

              <div className="mt-8">
                <Button
                  onClick={handlePaymentSubmit}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
                  disabled={loadingPost || loadingBookWallet}
                >
                  {loadingPost || loadingBookWallet ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Confirm & Pay"
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3">Cancellation Policy</h3>
              <p className="text-gray-600 text-sm">
                {trip.cancelation_hours > 0 ? (
                  `Free cancellation up to ${trip.cancelation_hours} hours before departure.`
                ) : (
                  "No cancellations allowed for this trip."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your booking for {travelers} seat{travelers !== 1 ? 's' : ''} on {trip.trip_name} is confirmed.
            </p>
            <div className="space-y-3">
              {/* <Button
                onClick={() => navigate("/my-trips")}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
              >
                View My Trips
              </Button> */}
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-3 rounded-lg"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;