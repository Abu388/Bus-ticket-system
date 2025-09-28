// Naveigator.jsx (Enhanced Version)
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Naveigator = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("ticket");

  useEffect(() => {
    if (location.pathname === "/ticket") setActiveTab("ticket");
    if (location.pathname === "/round-trip") setActiveTab("round-trip");
    if (location.pathname === "/multi-city") setActiveTab("multi-city");
  }, [location.pathname]);

  const tabConfig = {
    "ticket": {
      color: "blue",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      description: "Book a one-way journey to your destination"
    },
    "round-trip": {
      color: "green",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      description: "Book going and return trips together and save"
    },
    "multi-city": {
      color: "purple",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: "Plan complex itineraries with multiple stops"
    }
  };

  const getButtonClass = (tab) => {
  const config = tabConfig[tab];
  return `w-full py-4 px-6 text-base font-semibold transition-all duration-300 rounded-xl border-2 ${
    activeTab === tab 
      ? `bg-${config.color}-600 text-black shadow-lg shadow-${config.color}-200 border-${config.color}-600` 
      : `text-gray-700 bg-white border-gray-200`
  }`;
};


  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3"
            >
              Discover Ethiopia
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg"
            >
              Choose your travel style and embark on an unforgettable journey
            </motion.p>
          </div>

          {/* Navigation Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-3 mb-8 border border-gray-200/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {["ticket", "round-trip", "multi-city"].map((tab) => (
                <Link key={tab} to={`/${tab === 'ticket' ? 'ticket' : tab}`}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className={getButtonClass(tab)}>
                      <span className="flex items-center justify-center gap-3">
                        {tabConfig[tab].icon}
                        {tab === "ticket" ? "One Way" : tab === "round-trip" ? "Round Trip" : "Multi-City"}
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Active Tab Indicator */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-lg border">
                {Object.entries(tabConfig).map(([tab, config]) => (
                  <div key={tab} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      activeTab === tab ? `bg-${config.color}-500` : "bg-gray-300"
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      activeTab === tab ? `text-${config.color}-600` : "text-gray-400"
                    }`}>
                      {tab === "ticket" ? "One Way" : tab === "round-trip" ? "Round Trip" : "Multi-City"}
                    </span>
                  </div>
                ))}
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-lg mt-4 font-medium"
              >
                {tabConfig[activeTab].description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Naveigator;