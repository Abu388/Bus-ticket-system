import React, { useState } from "react";
import { Link } from "react-router-dom";


const TypesOfBus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const types = [
    {
      id: 1,
      name: "Selam Bus",
      description: "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
      print: 800,
      image: "https://image.made-in-china.com/202f0j00NnUhFpCalKqc/Cheap-Used-Yellow-Yutong-Bus-Car-6122-and-40-Seats-Used-Coach-Tourist-Bus.webp",
      features: ["WiFi", "AC", "Entertainment", "USB Charging", "Snack Service"],
      capacity: "40 seats",
      rating: 4.5,
      travelClass: "Standard"
    },
    {
      id: 2,
      name: "Zemen Bus",
      description: "Premium comfort with extra legroom and premium amenities for business travelers.",
      print: 900,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9fQLF3FWfBaB9A5o_H6Jts7X_hMN9K0LxPw&s",
      features: ["WiFi", "AC", "Premium Seats", "USB Charging", "Meal Service"],
      capacity: "36 seats",
      rating: 4.8,
      travelClass: "Premium"
    },
    {
      id: 3,
      name: "Sky Bus",
      description: "Economical option with comfortable seating and essential amenities for budget travelers.",
      print: 750,
      image: "https://img.12go.asia/0/fit/0/320/ce/0/plain/s3://12go-web-static/static/images/operator/13152/class/29-outside.jpg",
      features: ["WiFi", "AC", "Comfortable", "Restroom", "Water Service"],
      capacity: "44 seats",
      rating: 4.2,
      travelClass: "Economy"
    },
    {
      id: 4,
      name: "Golden Bus",
      description: "Family-friendly buses with spacious seating and entertainment options for all ages.",
      print: 630,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0sYLsr8S0vi9NJMXBuvBd1vMMSnWMuJNxIA&s",
      features: ["WiFi", "AC", "Family Seating", "Entertainment", "Snack Service"],
      capacity: "42 seats",
      rating: 4.3,
      travelClass: "Family"
    },
    {
      id: 5,
      name: "Liyu Bus",
      description: "Luxury travel experience with premium amenities and exceptional service quality.",
      print: 850,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMrj-LwqW97gsz0WGOovX2huKspBl_apaFpA&s",
      features: ["WiFi", "AC", "Luxury Seats", "Gourmet Meals", "Personal Service"],
      capacity: "32 seats",
      rating: 4.9,
      travelClass: "Luxury"
    },
  ];

  // Filter and sort buses
  const filteredAndSortedBuses = types
    .filter(bus => {
      const matchesSearch = bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bus.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bus.travelClass.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = priceFilter === "all" ? true :
                          priceFilter === "budget" ? bus.print <= 700 :
                          priceFilter === "mid" ? bus.print > 700 && bus.print <= 800 :
                          bus.print > 800;
      
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.print - b.print;
        case "price-high":
          return b.print - a.print;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getTravelClassColor = (travelClass) => {
    switch (travelClass) {
      case "Luxury":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Premium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Standard":
        return "bg-green-100 text-green-800 border-green-200";
      case "Economy":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Family":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Our Bus Fleet
            </h1>
            <p className="text-xl text-gray-600 max-w-6xl mx-auto">
              Discover our diverse range of buses, each designed to provide you with the perfect travel experience. 
              From budget-friendly options to luxury coaches, find the ideal bus for your journey.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              
              {/* Search Bar */}
              <div className="lg:col-span-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Search Buses
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, description, or class..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Price Filter */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Price Range
                </label>
                <div className="relative">
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="all">All Prices</option>
                    <option value="budget">Budget (≤ ETB 700)</option>
                    <option value="mid">Mid-range (ETB 701-800)</option>
                    <option value="premium">Premium (≥ ETB 801)</option>
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                    <option value="rating">Rating</option>
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="lg:col-span-2">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{filteredAndSortedBuses.length}</div>
                  <div className="text-sm text-blue-800">Buses Found</div>
                </div>
              </div>

            </div>
          </div>

          {/* Bus Grid */}
          <div className="mb-12">
            {filteredAndSortedBuses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🚌</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No buses found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedBuses.map((bus) => (
                  <div 
                    key={bus.id} 
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={bus.image}
                        alt={bus.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/800x200?text=Bus+Image+Not+Available";
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full border-2 text-sm font-semibold ${getTravelClassColor(bus.travelClass)}`}>
                          {bus.travelClass}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        {renderStars(bus.rating)}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {bus.name}
                        </h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">ETB {bus.print}</div>
                          <div className="text-sm text-gray-500">per person</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{bus.capacity}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {bus.description}
                      </p>
                      
                      {/* Features */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {bus.features.map((feature, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Link
                          to="/ticket"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold"
                        >
                          Book Now
                        </Link>
                        <button className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Bus Class Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">L</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Luxury</h4>
                <p className="text-gray-600">Premium service & amenities</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">P</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Premium</h4>
                <p className="text-gray-600">Business class comfort</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">S</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Standard</h4>
                <p className="text-gray-600">Comfortable & reliable</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-yellow-600 font-bold">E</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Economy </h4>
                <p className="text-gray-600">Budget-friendly option</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-pink-600 font-bold">F</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Family</h4>
                <p className="text-gray-600">Spacious & family-friendly</p>
              </div>
            </div>
          </div>
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
};

export default TypesOfBus;