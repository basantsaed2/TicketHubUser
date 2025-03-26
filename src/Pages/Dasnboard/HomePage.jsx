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
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from '../../Context/Auth';
import { useNavigate } from 'react-router-dom';
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e);
    },
  });
  return null;
};

const TravelBooking = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchBookingList, data: bookingListData } = useGet({ url: `https://bcknd.ticket-hub.net/user/booking/lists` });
  const { postData: postGeneral ,loadingPost, response} = usePost({ url: `${apiUrl}/user/booking` });
  const { postData: postPrivate} = usePost({ url: `${apiUrl}/user/booking/private_request` });
  const auth = useAuth();
  const navigate = useNavigate();

  // Lists Data
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCar, setSelectedCar] = useState("");

  const [modalVisible,setModalVisible] = useState(false);
  const [selectedFromCity, setSelectedFromCity] = useState("");
  const [selectedToCity, setSelectedToCity] = useState("");

  // Main filters state
  const [travelDate, setTravelDate] = useState("");
  const [roundDate, setRoundDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [tripType, setTripType] = useState("");

  // Main route type and filter mode
  const [routeType, setRouteType] = useState("all");
  const [filterMode, setFilterMode] = useState("general");
  const [activeTab, setActiveTab] = useState("all");

  // Private mode extra fields
  const [address, setAddress] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState([31.2001, 29.9187]); // default: Alexandria

  const today = new Date().toISOString().split("T")[0];
  const minRoundDate = travelDate 
    ? new Date(new Date(travelDate).setDate(new Date(travelDate).getDate() + 1)).toISOString().split("T")[0] 
    : today;

  useEffect(() => {
    refetchBookingList();
  }, [refetchBookingList]);

  useEffect(() => {
    if (bookingListData && bookingListData.countries && bookingListData.cities) {
      setCountries(bookingListData.countries);
      setCities(bookingListData.cities);
      setCars(bookingListData.car);
    }
  }, [bookingListData]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setMapLocation([lat, lng]);
    setShowMap(false);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    // Optionally, navigate or perform other actions after closing the modal
  };
  
  useEffect(() => {
    if (response && !loadingPost) {
          console.log('Response:', response.data);
          console.log('service:', activeTab);
          navigate('/search_result', { state: { trips: response.data, service: activeTab } });
    }
  }, [response]);     
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.user) {
      auth.toastError('You must be logged in to continue.')
      navigate('auth/login', { replace: true })
      return;
    }
    else
      {
      // if (!travelDate) {
      //   auth.toastError('Please enter the travel date.');
      //   return;
      // }
      // if (filterMode === "general" && (!selectedFromCity || !selectedToCity)) {
      //   auth.toastError('Please select both departure and arrival locations.');
      //   return;
      // }
      // if (filterMode === "private") {
      //   if (!selectedCity) {
      //     auth.toastError('Please select the city.');
      //     return;
      //   }
      //   if (!address) {
      //     auth.toastError('Please enter the address.');
      //     return;
      //   }
      //   if (!selectedCar) {
      //     auth.toastError('Please select the car type.');
      //     return;
      //   }
      //   if (!mapLocation[0] && !mapLocation[1]) {
      //     auth.toastError('Please select the pickup location on the map.');
      //     return;
      //   }
      // }

      const formData = {
        from: selectedFromCity,
        to: selectedToCity,
        date: travelDate,
        travelers: travelers,
      };

      if (filterMode === "general") {
        formData.round_date = roundDate;
        formData.type = tripType;
        postGeneral(formData);
      } else if (filterMode === "private") {
        formData.city_id = selectedCity;
        formData.country_id = selectedCountry;
        formData.address = address;
        formData.map = `https://www.google.com/maps?q=${mapLocation[0].toFixed(4)},${mapLocation[1].toFixed(4)}`;
        formData.car_id = selectedCar;
        postPrivate(formData);
        const response = await postPrivate(formData);
        // Check response status (adjust according to your API response)
        if (response.status === 200 || response.status === 201) {
          setModalVisible(true);
        }}
      }
  };

  return (
    <div className="relative w-full pb-32 md:mb-20 mb-40">
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
            <div className="w-full md:w-2/4 mx-auto bg-white rounded-t-md border-b border-fifthColor">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 w-full p-0 text-black bg-white">
                  <TabsTrigger value="all" className="w-full font-semibold data-[state=active]:bg-mainColor data-[state=active]:text-white">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="hiace" className="w-full font-semibold data-[state=active]:bg-mainColor data-[state=active]:text-white">
                    Hivace
                  </TabsTrigger>
                  <TabsTrigger value="train" className="w-full font-semibold data-[state=active]:bg-mainColor data-[state=active]:text-white">
                    Trains
                  </TabsTrigger>
                  <TabsTrigger value="bus" className="w-full font-semibold data-[state=active]:bg-mainColor data-[state=active]:text-white">
                    Bus
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all" />
                <TabsContent value="hivace" />
                <TabsContent value="trains" />
                <TabsContent value="bus" />
              </Tabs>
            </div>
            {/* Form Section */}
            <div className="w-full md:p-4 p-2">
              <form onSubmit={handleSubmit}>
                <div className={`grid grid-cols-2 md:grid-cols-4 ${filterMode === "general" ? 'xl:grid-cols-6' : 'xl:grid-cols-7'} gap-2`}>
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
                  {filterMode === "general" ? (
                    <>
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
                    </>
                  ) : (
                    <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                      <label className="text-sm font-semibold mb-1">Departure From</label>
                      <Select defaultValue={selectedCity} onValueChange={setSelectedCity} className="w-full">
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
                  )}

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
                  <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                    <label className="text-sm font-semibold mb-1">Round Date</label>
                    <Input
                      type="date"
                      value={roundDate}
                      min={minRoundDate}
                      onChange={(e) => setRoundDate(e.target.value)}
                      className="w-full border-b border-secoundColor px-3 py-2 text-black focus-visible:ring-0 focus-visible:border-secoundColor"
                    />
                  </div>

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

                  {filterMode === "general" ? (
                    <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                      <label className="text-sm font-semibold mb-1">Trip Type</label>
                      <Select onValueChange={setTripType}>
                        <SelectTrigger className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor">
                          <SelectValue placeholder="Trip Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one_way">One Way</SelectItem>
                          <SelectItem value="round_trip">Round Trip</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                        <label className="text-sm font-semibold mb-1">Car Type</label>
                        <Select onValueChange={setSelectedCar}>
                          <SelectTrigger className="w-full border-b border-secoundColor px-3 py-2 text-black focus:ring-0 focus:border-secoundColor">
                            <SelectValue placeholder="Select Car" />
                          </SelectTrigger>
                          <SelectContent>
                            {cars.map((car) => (
                              <SelectItem key={car.id} value={String(car.id)}>
                                {car.brand?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col bg-fifthColor p-2 rounded-lg">
                        <label className="text-sm font-semibold mb-1">PickUp Location</label>
                        <Input
                          type="text"
                          value={
                            mapLocation[0] !== 0 && mapLocation[1] !== 0
                              ? `https://www.google.com/maps?q=${mapLocation[0].toFixed(4)},${mapLocation[1].toFixed(4)}`
                              : ""
                          }
                          placeholder="Click to select on map"
                          onFocus={() => setShowMap(true)}
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
                    onClick={handleSubmit}
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

      {/* Map Popup for selecting address */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] h-[60vh] relative">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              ×
            </button>
            {/* Address Input Field */}
            <div className="mb-2">
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address here"
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>
            {/* Map Container */}
            <MapContainer center={mapLocation} zoom={13} className="w-full h-[calc(100%-80px)]">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={mapLocation} />
              <MapClickHandler onMapClick={handleMapClick} />
            </MapContainer>
            {/* Generated Link */}
            <div className="mt-2 text-center">
              <span
                className="text-blue-500 underline cursor-pointer"
                onClick={() => {
                  const link = `https://www.google.com/maps?q=${mapLocation[0]},${mapLocation[1]}`;
                  navigator.clipboard.writeText(link);
                  alert("Link copied to clipboard!");
                }}
              >
                {`https://www.google.com/maps?q=${mapLocation[0]},${mapLocation[1]}`}
              </span>
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
            <button 
              onClick={handleCloseModal} 
              className="btn btn-primary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TravelBooking;
