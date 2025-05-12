import React, { useState, useEffect } from 'react';
import backgroundImage from "../../Assets/Images/backgroundImage.png";
import { usePost } from '../../Hooks/usePostJson';
import { useGet } from '../../Hooks/useGet';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/Components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Button } from '@/Components/ui/button';
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from '../../Context/Auth';
import { useNavigate } from 'react-router-dom';
// MapClickHandler that updates the position without closing the modal
const MapClickHandler = ({ onMapClick }) => {
  useMapEvent("click", onMapClick);
  return null;
};

const TravelBooking = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchBookingList, data: bookingListData } = useGet({ url: `https://bcknd.ticket-hub.net/user/booking/lists` });
  const { postData: postGeneral ,loadingPost, response} = usePost({ url: `${apiUrl}/user/booking` });
  const { postData: postPrivate ,loadingPost:loadingPrivate ,response:responsePrivate} = usePost({ url: `${apiUrl}/user/booking/private_request` });
  const auth = useAuth();
  const navigate = useNavigate();

  // Lists Data
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCar, setSelectedCar] = useState("");

  const [modalVisible,setModalVisible] = useState(false);
  const [selectedFromCity, setSelectedFromCity] = useState("");
  const [selectedToCity, setSelectedToCity] = useState("");

  // Main filters state
  const today = new Date().toISOString().split("T")[0];

  const [travelDate, setTravelDate] = useState(today);
  const [roundDate, setRoundDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [tripType, setTripType] = useState("");

  const minRoundDate = travelDate 
  ? new Date(new Date(travelDate).setDate(new Date(travelDate).getDate() + 1)).toISOString().split("T")[0] 
  : today;

  // Main route type and filter mode
  const [routeType, setRouteType] = useState("all");
  const [filterMode, setFilterMode] = useState("general");
  const [activeTab, setActiveTab] = useState("all");

  // Private mode extra fields
  const [addressFrom, setAddressFrom] = useState("");
  const [addressTo, setAddressTo] = useState("");
  
  const [mapLocationFrom, setMapLocationFrom] = useState([26.8206, 30.8025]); // Default: Egypt's center
  const [mapLocationTo, setMapLocationTo] = useState([26.8206, 30.8025]); // Default: Egypt's center
  const [showMapFrom, setShowMapFrom] = useState(false); // To toggle "From" map modal
  const [showMapTo, setShowMapTo] = useState(false); // To toggle "To" map modal

  useEffect(() => {
    refetchBookingList();
  }, [refetchBookingList]);

  useEffect(() => {
    if (bookingListData && bookingListData.countries && bookingListData.cities) {
      setCountries(bookingListData.countries);
      setCities(bookingListData.cities);
      setCars(bookingListData.car_category);
    }
  }, [bookingListData]);

    // Instead of auto-closing on click, we only update the marker:
    const handleMapClickFrom = (e) => {
      const { lat, lng } = e.latlng;
      setMapLocationFrom([lat, lng]);
    };
  
    const handleMapClickTo = (e) => {
      const { lat, lng } = e.latlng;
      setMapLocationTo([lat, lng]);
    };
  
  const handleCloseModal = () => {
    setModalVisible(false);
    // Optionally, navigate or perform other actions after closing the modal
  };
  
  useEffect(() => {
    if (response && !loadingPost) {
          console.log('Response:', response.data);
          console.log('service:', activeTab);
          navigate('/trips', { state: { trips: response.data, service: activeTab, searchData: {  // Add the form data you want to pass
            from: selectedFromCity,
            to: selectedToCity,
            date: travelDate,
            roundDate: roundDate,
            travelers: travelers,
            tripType: roundDate ? "round_trip" : "one_way"
          } } });
    }
  }, [response]);  
  
  useEffect(() => {
    if (responsePrivate && !loadingPrivate) {
      setModalVisible(true)
    }
  }, [responsePrivate]);  
 
  const handleSubmit = async (e) => {
    e.preventDefault();

      const formData = {
        // from: selectedFromCity,
        // to: selectedToCity,
        date: travelDate,
        traveler: travelers,
      };

      if (filterMode === "general") {
        if (roundDate) {
            formData.round_date = roundDate;
            formData.type = "round_trip";
        } else {
            formData.type = "one_way";
        }      
        formData.from = selectedFromCity;
        formData.to = selectedToCity;
        postGeneral(formData);
      } 
      else if (filterMode === "private") {
        if (!auth.user) {
          auth.toastError('You must be logged in to continue.');
          navigate('/auth/login', { replace: true });
          return;
        } 
        formData.country_id = selectedCountry;
        formData.city_id = selectedToCity;
        formData.address = addressTo;
        formData.from_address = addressFrom;
        formData.map = `https://www.google.com/maps?q=${mapLocationTo[0].toFixed(4)},${mapLocationTo[1].toFixed(4)}`; // Google Maps link for "To"
        formData.category_id = selectedCar;
        formData.from_city_id = selectedFromCity;
        formData.from_map = `https://www.google.com/maps?q=${mapLocationFrom[0].toFixed(4)},${mapLocationFrom[1].toFixed(4)}`; // Google Maps link for "From"
        
        postPrivate(formData);
      }};

  return (
    <div className="relative w-full h-screen lg:mb-10 xl:mb-5 mb-20">
      {/* Top Section: Background Image with Overlapping Search Box */}
      <div className="relative">
        <img
          src={backgroundImage}
          alt="background"
          className="w-full h-96 object-cover"
        />
        {/* Overlapping Container starts at the bottom of the image */}
        <div className="absolute bottom-0 left-5 right-5 transform translate-y-1/2">
          <div className="bg-white shadow-xl rounded-lg p-4">
            {/* Secondary Filter Mode Tabs */}
            <div className="flex mb-4">
              <button
                onClick={() => setFilterMode("general")}
                className={`px-4 py-2 font-semibold ${filterMode === "general" ? "bg-mainColor text-white" : "bg-gray-200 text-black"}`}
              >
                Request
              </button>
              <button
                onClick={() => setFilterMode("private")}
                className={`px-4 py-2 font-semibold ml-2 ${filterMode === "private" ? "bg-mainColor text-white" : "bg-gray-200 text-black"}`}
              >
                Private Request
              </button>
            </div>
            {/* Main Tabs: All, Hivace, Trains, Bus */}
            {
              filterMode==="general" && 
              <div className="w-full md:w-2/4 mx-auto bg-white rounded-t-md border-b border-fifthColor">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 w-full p-0 text-black bg-white">
                  <TabsTrigger value="all" className="w-full text-lg data-[state=active]:bg-mainColor data-[state=active]:text-white">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="hiace" className="w-full text-lg data-[state=active]:bg-mainColor data-[state=active]:text-white">
                    Hiaces
                  </TabsTrigger>
                  <TabsTrigger value="train" className="w-full text-lg data-[state=active]:bg-mainColor data-[state=active]:text-white">
                    Trains
                  </TabsTrigger>
                  <TabsTrigger value="bus" className="w-full text-lg data-[state=active]:bg-mainColor data-[state=active]:text-white">
                    Bus
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all" />
                <TabsContent value="hivace" />
                <TabsContent value="trains" />
                <TabsContent value="bus" />
              </Tabs>
            </div>
            }

            {/* Form Section */}
            <div className="w-full md:p-4 p-2">
            <form onSubmit={handleSubmit}>
                <div className={`grid grid-cols-2 lg:grid-cols-3 ${filterMode === "general" ? 'xl:grid-cols-5' : 'xl:grid-cols-5'} gap-2`}>
                  {/* Conditional Fields Based on Filter Mode */}
                  {filterMode === "private" && (
                    <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                    <label className="text-sm font-semibold mb-1">Country</label>
                    <Select defaultValue={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((Country) => (
                          <SelectItem key={Country.id}  value={String(Country.id)}>
                            {Country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
                  )}
                 
                  <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                    <label className="text-sm font-semibold mb-1">Departure From</label>
                    <Select defaultValue={selectedFromCity} onValueChange={setSelectedFromCity} className="w-full">
                      <SelectTrigger className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={String(city.id)}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                    <label className="text-sm font-semibold mb-1">Arrival To</label>
                    <Select defaultValue={selectedToCity} onValueChange={setSelectedToCity} className="w-full">
                      <SelectTrigger className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={String(city.id)}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Travel Date */}
                  <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                    <label className="text-sm font-semibold mb-1">Travel Date</label>
                    <Input
                      type="date"
                      value={travelDate}
                      min={today}
                      max={roundDate || ""}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor"
                    />
                  </div>

                  {/* Round Date */}
                  {filterMode === "general" && (
                  <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                    <label className="text-sm font-semibold mb-1">Return Date</label>
                    <Input
                      type="date"
                      value={roundDate}
                      min={minRoundDate}
                      onChange={(e) => setRoundDate(e.target.value)}
                      className="w-full border-b border-secoundColor px-3 py-2 text-black focus-visible:ring-0 focus-visible:border-secoundColor"
                    />
                  </div>
                  )}

                  {/* Number of Travelers */}
                  <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                    <label className="text-sm font-semibold mb-1">Number of Travelers</label>
                    <Input
                      type="number"
                      min="1"
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="w-full border-b border-secoundColor px-3 py-2 text-black focus-visible:ring-0 focus-visible:border-secoundColor"
                    />
                  </div>

                  {filterMode === "private" && (
                    <>
                    <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                      <label className="text-sm font-semibold mb-1">Car Category</label>
                      <Select onValueChange={setSelectedCar}>
                        <SelectTrigger className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor">
                          <SelectValue placeholder="Select Car Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {cars.map((car) => (
                            <SelectItem key={car.id} value={String(car.id)}>
                              {car.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div> 
                    
                    <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                      <label className="text-sm font-semibold mb-1">Address From</label>
                      <Input
                        type="text"
                        value={addressFrom}
                        onChange={(e) => setAddressFrom(e.target.value)}
                        required
                        placeholder="Enter address here"
                        className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor"
                      />
                    </div>
                    
                    <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                      <label className="text-sm font-semibold mb-1">Address To</label>
                      <Input
                        type="text"
                        value={addressTo}
                        onChange={(e) => setAddressTo(e.target.value)}
                        required
                        placeholder="Enter address here"
                        className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor"
                      />
                    </div>

                    {/* --- From Location Input --- */}
                    <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                      <label className="text-sm font-semibold mb-1">PickUp Location (From)</label>
                      <Input
                        type="text"
                        value={
                          mapLocationFrom[0] !== 0 && mapLocationFrom[1] !== 0
                            ? `https://www.google.com/maps?q=${mapLocationFrom[0].toFixed(4)},${mapLocationFrom[1].toFixed(4)}`
                            : ""
                        }
                        placeholder="Click to select on map"
                        onFocus={() => setShowMapFrom(true)}
                        readOnly
                        className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor"
                      />
                    </div>

                    {/* --- To Location Input --- */}
                    <div className="flex flex-col bg-fifthColor p-2 rounded-lg ">
                      <label className="text-sm font-semibold mb-1">Drop Location (To)</label>
                      <Input
                        type="text"
                        value={
                          mapLocationTo[0] !== 0 && mapLocationTo[1] !== 0
                            ? `https://www.google.com/maps?q=${mapLocationTo[0].toFixed(4)},${mapLocationTo[1].toFixed(4)}`
                            : ""
                        }
                        placeholder="Click to select on map"
                        onFocus={() => setShowMapTo(true)}
                        readOnly
                        className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor"
                      />
                    </div>
                    </>
                  )}
                </div>

                {/* Search Button */}
                <div className="w-full flex flex-col justify-center items-center mt-4">
                  <Button
                    type='submit'
                    className="bg-orange-500 text-xl hover:bg-orange-600 text-white font-semibold px-6 py-4 rounded-lg"
                  >
                    {filterMode === "general" ? "Search" : "Request"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal for "From" Location --- */}
      {showMapFrom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] h-[60vh] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">Select PickUp Location</h3>
              </div>
              {/* Map Container */}
              <div className="flex-grow relative">
                <MapContainer
                  center={mapLocationFrom}
                  zoom={6}
                  className="w-full h-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={mapLocationFrom} />
                  <MapClickHandler onMapClick={handleMapClickFrom} />
                </MapContainer>
              </div>
              {/* Footer */}
              <div className="px-4 py-3 border-t flex justify-end">
                <button
                  onClick={() => setShowMapFrom(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
      )}

      {/* --- Modal for "To" Location --- */}
      {showMapTo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] h-[60vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Select Drop Location</h3>
            </div>
            {/* Map Container */}
            <div className="flex-grow relative">
              <MapContainer
                center={mapLocationTo}
                zoom={6}
                className="w-full h-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={mapLocationTo} />
                <MapClickHandler onMapClick={handleMapClickTo} />
              </MapContainer>
            </div>
            {/* Footer */}
            <div className="px-4 py-3 border-t flex justify-end">
              <button
                onClick={() => setShowMapTo(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="relative bg-white rounded-xl p-8 shadow-2xl max-w-md w-full text-center">
            {/* Close Button */}
            <button 
              onClick={handleCloseModal} 
              className="absolute top-2 right-2 btn btn-sm btn-ghost"
            >
              ✕
            </button>
            {/* Success Icon */}
            <div className="mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mx-auto h-12 w-12 text-mainColor" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-mainColor mb-4">
              Request Submitted
            </h2>
            <p className="text-gray-600 mb-6">
              Your request is under review. We will contact you soon!
            </p>
            <div className='w-full flex justify-center items-center'>
            <button 
              onClick={handleCloseModal} 
              className="btn btn-primary px-4 py-2 rounded-lg bg-mainColor hover:bg-secoundColor text-white"
            >
              Close
            </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TravelBooking;
