import React, { useState } from "react";
import { Link } from "react-router-dom";
import Naveigator from "@/Header/Naveigator";
// Dummy data for multi-city destinations
const multiCityDestinations = [
  {
    id: 1,
    routes: [
      { from: "Addis Ababa", to: "Bahir Dar", duration: "1h 30m" },
      { from: "Bahir Dar", to: "Gondar", duration: "2h 15m" },
      { from: "Gondar", to: "Lalibela", duration: "1h 45m" }
    ],
    description: "Explore the northern historical circuit with seamless connections.",
    totalDuration: "5h 30m",
    availableDates: ["2025-09-20", "2025-09-21", "2025-09-22"],
    image: "https://imgix.brilliant-ethiopia.com/fasil-ghebbi-royal-enclosure-gondar.jpg?auto=format,enhance,compress&fit=crop&crop=entropy,faces,focalpoint&w=580&h=480&q=40",
    price: 4500
  },
  {
    id: 2,
    routes: [
      { from: "Addis Ababa", to: "Hawassa", duration: "4h 30m" },
      { from: "Hawassa", to: "Arba Minch", duration: "3h 15m" },
      { from: "Arba Minch", to: "Jinka", duration: "2h 45m" }
    ],
    description: "Southern cultural and natural wonders tour.",
    totalDuration: "10h 30m",
    availableDates: ["2025-09-20", "2025-09-23", "2025-09-25"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl53snccJCGWDKGLfbyHzgj31SwGuOlnGYkQ&s",
    price: 5200
  },
  {
    id: 3,
    routes: [
      { from: "Addis Ababa", to: "Dire Dawa", duration: "1h 15m" },
      { from: "Dire Dawa", to: "Harar", duration: "45m" }
    ],
    description: "Eastern historical and cultural journey.",
    totalDuration: "2h",
    availableDates: ["2025-09-21", "2025-09-22", "2025-09-24"],
    image: "https://cdn.atrsafari.com/cdn/05explore/locations-and-lodges/africa/ethiopia/addis-ababa/0/stills/00page/01ADDI-IM0001-addis-ababa.jpg",
    price: 3200
  },
  {
    id: 4,
    routes: [
      { from: "Addis Ababa", to: "Axum", duration: "2h" },
      { from: "Axum", to: "Mekele", duration: "1h 30m" },
      { from: "Mekele", to: "Semera", duration: "2h 15m" },
      { from: "Semera", to: "Awash", duration: "1h 45m" }
    ],
    description: "Comprehensive northern Ethiopia exploration.",
    totalDuration: "7h 30m",
    availableDates: ["2025-09-22", "2025-09-24", "2025-09-26"],
    image: "https://cdn.britannica.com/23/93423-050-107B2836/obelisk-kingdom-Aksum-Ethiopian-name-city.jpg",
    price: 6800
  },
  {
    id: 5,
    routes: [
      { from: "Addis Ababa", to: "Jimma", duration: "5h" },
      { from: "Jimma", to: "Bonga", duration: "2h" },
      { from: "Bonga", to: "Mizan", duration: "3h" }
    ],
    description: "Southwestern coffee region adventure.",
    totalDuration: "10h",
    availableDates: ["2025-09-20", "2025-09-23", "2025-09-27"],
    image: "https://media-cdn.tripadvisor.com/media/photo-s/1a/fa/c9/84/the-rock-hewn-churches.jpg",
    price: 4100
  }
];

function MultiCity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  const allCities = [...new Set(multiCityDestinations.flatMap(dest => 
    dest.routes.flatMap(route => [route.from, route.to])
  ))];
  
  const passengerOptions = [1, 2, 3, 4, 5, 6];

  // Available dates based on selection
  const availableDates = startCity && endCity
    ? multiCityDestinations
        .filter(dest => {
          const firstRoute = dest.routes[0];
          const lastRoute = dest.routes[dest.routes.length - 1];
          return firstRoute.from === startCity && lastRoute.to === endCity;
        })
        .flatMap(dest => dest.availableDates)
    : [...new Set(multiCityDestinations.flatMap(dest => dest.availableDates))];

  // Filter destinations
  const filteredDestinations = multiCityDestinations.filter((dest) => {
    const matchesSearch = dest.routes.some(route => 
      route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.to.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStartCity = startCity ? dest.routes[0].from === startCity : true;
    const matchesEndCity = endCity ? dest.routes[dest.routes.length - 1].to === endCity : true;
    const matchesDate = date ? dest.availableDates.includes(date) : true;
    
    return matchesSearch && matchesStartCity && matchesEndCity && matchesDate;
  });

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/800x200?text=Image+Not+Available";
  };

  const handleRouteSelect = (destinationId) => {
    setSelectedRoutes(prev => 
      prev.includes(destinationId) 
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  const handleBookMultiple = () => {
    // Logic to handle booking multiple selected routes
    const selectedDestinations = multiCityDestinations.filter(dest => 
      selectedRoutes.includes(dest.id)
    );
    console.log("Booking:", selectedDestinations);
    // You can implement multi-booking logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Naveigator />
      
      {/* Hero Search Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Multi-City Adventures
            </h1>
            <p className="text-xl text-gray-600 max-w-6xl mx-auto">
              Plan complex itineraries with ease. Connect multiple destinations in one seamless journey across Ethiopia.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              
              {/* Start City */}
              <div className="lg:col-span-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Start City
                </label>
                <div className="relative">
                  <select
                    value={startCity}
                    onChange={(e) => {
                      setStartCity(e.target.value);
                      setDate("");
                    }}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Select starting city</option>
                    {allCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* End City */}
              <div className="lg:col-span-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  End City
                </label>
                <div className="relative">
                  <select
                    value={endCity}
                    onChange={(e) => {
                      setEndCity(e.target.value);
                      setDate("");
                    }}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Select final destination</option>
                    {allCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="lg:col-span-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Travel Date
                </label>
                <div className="relative">
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Select travel date</option>
                    {availableDates.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
            <br />
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search multi-city routes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 pl-12 pr-4 border-2 border-blue-200 rounded-2xl focus:border-blue-800 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Multi-select Action Bar */}
            {selectedRoutes.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-semibold">
                    {selectedRoutes.length} route(s) selected
                  </span>
                  <button
                    onClick={handleBookMultiple}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold"
                  >
                    Book Selected Routes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          
          {/* Destination Grid */}
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No multi-city routes found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredDestinations.map((dest) => (
                <div key={dest.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  <div className="relative">
                    <img
                      src={dest.image}
                      alt={`Multi-city route ${dest.routes[0].from} to ${dest.routes[dest.routes.length - 1].to}`}
                      className="w-full h-48 object-cover"
                      onError={handleImageError}
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {dest.routes.length} Stops
                    </div>
                    {/* <div className="absolute top-4 left-4">
                      <input
                        type="checkbox"
                        checked={selectedRoutes.includes(dest.id)}
                        onChange={() => handleRouteSelect(dest.id)}
                        className="w-5 h-5 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div> */}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {dest.routes[0].from} → {dest.routes[dest.routes.length - 1].to}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {dest.totalDuration}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {dest.description}
                    </p>
                    
                    {/* Route Details */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Route Details:
                      </div>
                      <div className="space-y-2">
                        {dest.routes.map((route, index) => (
                          <div key={index} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <span className="font-medium">{route.from} → {route.to}</span>
                            <span className="text-gray-500">{route.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        ETB {dest.price.toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to="/TypeOfBuss"
                          state={{
                            routes: dest.routes,
                            date: date || dest.availableDates[0],
                            image: dest.image,
                            price: dest.price,
                            passengers: 1,
                            isMultiCity: true,
                            totalDuration: dest.totalDuration
                          }}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold"
                        >
                          Book This Route
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Styles */}
      <style jsx>{`
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 1rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
          -webkit-print-color-adjust: exact;
        }
      `}</style>
    </div>
  );
}

export default MultiCity;