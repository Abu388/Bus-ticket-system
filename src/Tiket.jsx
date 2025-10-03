import React, { useState } from "react";
import { Link } from "react-router-dom";
import Naveigator from "./Header/Naveigator";

// Dummy data for destinations
const destinations = [
  {
    id: 1,
    from: "Hawassa, University Main Campus",
    to: "Addis Ababa",
    description: "The vibrant capital city to historic Gondar.",
    times: ["08:00 AM", "12:00 PM", "06:00 PM"],
    availableDates: ["2025-09-20", "2025-09-21", "2025-09-22"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLAEBgwe-YsXExpRQBgMSR-DO5KsMwfY4X7w&s",
  },
  {
    id: 2,
    from: "Bahir Dar",
    to: "Addis Ababa",
    description: "From stunning Lake Tana to the capital city.",
    times: ["07:00 AM", "01:00 PM", "05:00 PM"],
    availableDates: ["2025-09-20", "2025-09-23", "2025-09-24"],
    image: "https://cdn.atrsafari.com/cdn/05explore/locations-and-lodges/africa/ethiopia/addis-ababa/0/stills/00page/01ADDI-IM0001-addis-ababa.jpg",
  },
  {
    id: 3,
    from: "Gondar",
    to: "Lalibela",
    description: "From historic castles to rock-hewn churches.",
    times: ["09:00 AM", "02:00 PM"],
    availableDates: ["2025-09-21", "2025-09-22"],
    image: "https://media-cdn.tripadvisor.com/media/photo-s/1a/fa/c9/84/the-rock-hewn-churches.jpg",
  },
  {
    id: 4,
    from: "Arba Minch",
    to: "Hawassa",
    description: "From serene Lake Hawassa to beautiful Arba Minch.",
    times: ["06:00 AM", "11:00 AM", "04:00 PM"],
    availableDates: ["2025-09-20", "2025-09-23", "2025-09-25"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl53snccJCGWDKGLfbyHzgj31SwGuOlnGYkQ&s",
  },
  {
    id: 5,
    from: "Lalibela",
    to: "Axum",
    description: "From UNESCO rock-hewn churches to ancient Axum.",
    times: ["10:00 AM", "03:00 PM"],
    availableDates: ["2025-09-22", "2025-09-24"],
    image: "https://cdn.britannica.com/23/93423-050-107B2836/obelisk-kingdom-Aksum-Ethiopian-name-city.jpg",
  },
  {
    id: 6,
    from: "Addis Ababa, Lamberet ",
    to: "Gondar",
    description: "The vibrant capital city to historic Gondar.",
    times: ["08:00 AM", "12:00 PM", "06:00 PM"],
    availableDates: ["2025-09-20", "2025-09-21", "2025-09-22"],
    image: "https://imgix.brilliant-ethiopia.com/fasil-ghebbi-royal-enclosure-gondar.jpg?auto=format,enhance,compress&fit=crop&crop=entropy,faces,focalpoint&w=580&h=480&q=40",
  },
  {
    id: 7,
    from: "Hawassa, South Spring Hotel",
    to: "Addis Ababa",
    description: "The vibrant capital city to historic Gondar.",
    times: ["08:00 AM", "12:00 PM", "06:00 PM"],
    availableDates: ["2025-09-20", "2025-09-21", "2025-09-22"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLAEBgwe-YsXExpRQBgMSR-DO5KsMwfY4X7w&s",
  },
  {
    id: 8,
    from: "Addis Ababa, UNISA",
    to: "Hawassa",
    description: "The vibrant capital city to historic Gondar.",
    times: ["08:00 AM", "12:00 PM", "06:00 PM"],
    availableDates: ["2025-09-20", "2025-09-21", "2025-09-22"],
    image: "https://imgix.brilliant-ethiopia.com/fasil-ghebbi-royal-enclosure-gondar.jpg?auto=format,enhance,compress&fit=crop&crop=entropy,faces,focalpoint&w=580&h=480&q=40",
  },
  {
    id: 9,
    from: "Shashemene, Tantostia Hotel",
    to: "Hawassa",
    description: "The vibrant capital city to historic Gondar.",
    times: ["08:00 AM", "12:00 PM", "06:00 PM"],
    availableDates: ["2025-09-20", "2025-09-21", "2025-09-22"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd79WiCLQjPVjMVvzVxwRvr6kOcKZfq1hLAA&s",
  },
];

function Ticket() {
  const [searchTerm, setSearchTerm] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");

  const cities = [...new Set(destinations.flatMap((dest) => [dest.from, dest.to]))];
  const passengerOptions = [1, 2, 3, 4, 5, 6];

  // Available times based on selection
  const availableTimes = from && to && date
    ? destinations
        .filter((dest) => dest.from === from && dest.to === to && dest.availableDates.includes(date))
        .flatMap((dest) => dest.times)
    : [...new Set(destinations.flatMap((dest) => dest.times))];

  // Available dates based on selection
  const availableDates = from && to
    ? destinations
        .filter((dest) => dest.from === from && dest.to === to)
        .flatMap((dest) => dest.availableDates)
    : [...new Set(destinations.flatMap((dest) => dest.availableDates))];

  // Filter destinations
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFrom = from ? dest.from === from : true;
    const matchesTo = to ? dest.to === to : true;
    const matchesTime = time ? dest.times.includes(time) : true;
    const matchesDate = date ? dest.availableDates.includes(date) : true;
    return matchesSearch && matchesFrom && matchesTo && matchesTime && matchesDate;
  });

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/800x200?text=Image+Not+Available";
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
              Discover Amazing Destinations
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Book your perfect journey with ease. Explore Ethiopia's beautiful routes with our premium bus services.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              
              {/* From */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  From
                </label>
                <div className="relative">
                  <select
                    value={from}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      setTo("");
                      setTime("");
                      setDate("");
                    }}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Select origin</option>
                    {cities.map((city) => (
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

              {/* To */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  To
                </label>
                <div className="relative">
                  <select
                    value={to}
                    onChange={(e) => {
                      setTo(e.target.value);
                      setTime("");
                      setDate("");
                    }}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Select destination</option>
                    {cities.map((city) => (
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
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Date
                </label>
                <div className="relative">
                  <select
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setTime("");
                    }}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Select date</option>
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

              {/* Time */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Time
                </label>
                <div className="relative">
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Select time</option>
                    {availableTimes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>


            </div>
            <br />
            {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations..."
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

            {/* Search Button */}
            <div className="mt-8 flex justify-center">
              


            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          

          

          {/* Destination Grid */}
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚌</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No destinations found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((dest) => (
                <div key={dest.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  <div className="relative">
                    <img
                      src={dest.image}
                      alt={`${dest.from} to ${dest.to}`}
                      className="w-full h-48 object-cover"
                      onError={handleImageError}
                    />
                    
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {dest.from} → {dest.to}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {dest.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Available: {dest.times.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Dates: {dest.availableDates.join(", ")}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      
                      <Link
                        to="/TypeOfBuss"
                        state={{
                          from: dest.from,
                          to: dest.to,
                          date: date || dest.availableDates[0],
                          time: time || dest.times[0],
                          image: dest.image,
                          price: 0, // default, will be updated in TypeOfBus when a bus is selected
                          passengers: 1,
                        }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold"
                      >
                        Book Now
                      </Link>
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

export default Ticket;