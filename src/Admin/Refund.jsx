import React, { useState, useContext } from "react";
import { RefundContext } from "@/Context/RefundContext.jsx";

function Refund() {
  const { addRefund } = useContext(RefundContext);
  const [refundDescription, setRefundDescription] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [refundDate, setRefundDate] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (refundDate.trim() && ticketNumber.trim() && accountNumber.trim() && refundDescription.trim()) {
      
      // Create refund object
      const newRefund = {
        RefundDate: refundDate,
        TicketNumber: ticketNumber,
        AccountNumber: accountNumber,
        RefundDescription: refundDescription,
      };
      
      // Add to context (which will also save to localStorage)
      addRefund(newRefund);
      
      setShowAlert(true);
      
      // Hide the alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      // Reset form
      setRefundDate("");
      setTicketNumber("");
      setAccountNumber("");
      setRefundDescription("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Refund Request
            </h1>
            <p className="text-xl text-gray-600 max-w-6xl mx-auto">
              Submit your refund details below to process your request. We'll review your request and get back to you within 24-48 hours.
            </p>
          </div>

          {/* Alert message */}
          {showAlert && (
            <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-in">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Your refund request has been submitted!</span>
              </div>
            </div>
          )}

          {/* Rest of your refund form remains the same */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                
                {/* Refund Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Refund Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={refundDate}
                      onChange={(e) => setRefundDate(e.target.value)}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Ticket Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Ticket Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Ticket Number"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 appearance-none bg-white"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Account Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Account Number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 appearance-none bg-white"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* Refund Description */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Refund Description
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Please describe the reason for your refund request..."
                    value={refundDescription}
                    onChange={(e) => setRefundDescription(e.target.value)}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 appearance-none bg-white min-h-[150px] resize-vertical"
                    required
                  />
                  <div className="absolute left-4 top-4 transform">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-12 py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Submit Refund Request
                </button>
              </div>
            </form>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Refund Policy Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Refunds processed within 24-48 hours</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Full refund for cancellations 24+ hours before departure</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>50% refund for cancellations 6-24 hours before departure</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>No refund for cancellations less than 6 hours before departure</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>No refund for no-shows</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Service fees are non-refundable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        select, input[type="date"] {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 1rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
          -webkit-print-color-adjust: exact;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
        
        .resize-vertical {
          resize: vertical;
        }
      `}</style>
    </div>
  );
}

export default Refund;