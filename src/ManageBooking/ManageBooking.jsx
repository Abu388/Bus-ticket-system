import React, { useContext, useState, useEffect } from "react";
import { RefundContext } from "../Context/RefundContext";
import TravelBooking from "./TravelBooking";
import { Link } from "react-router-dom";
function ManageBooking() {
    const { allRefunds } = useContext(RefundContext);
    const [refunds, setRefunds] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    // Load refunds from localStorage and context
    useEffect(() => {
        const savedRefunds = JSON.parse(localStorage.getItem('refunds') || '[]');
        setRefunds(savedRefunds);
    }, [lastUpdate]);

    // Update local state when allRefunds changes
    useEffect(() => {
        if (allRefunds && allRefunds.length > 0) {
            setRefunds(allRefunds);
        }
    }, [allRefunds, lastUpdate]);

    // Listen for storage changes (when supervisor updates status)
    useEffect(() => {
        const handleStorageChange = () => {
            setLastUpdate(Date.now());
        };

        window.addEventListener('storage', handleStorageChange);

        // Also check for changes periodically (every 2 seconds)
        const interval = setInterval(() => {
            const savedRefunds = JSON.parse(localStorage.getItem('refunds') || '[]');
            if (JSON.stringify(savedRefunds) !== JSON.stringify(refunds)) {
                setRefunds(savedRefunds);
            }
        }, 2000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [refunds]);

    const refreshData = () => {
        const savedRefunds = JSON.parse(localStorage.getItem('refunds') || '[]');
        setRefunds(savedRefunds);
        setLastUpdate(Date.now());
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'text-green-600 bg-green-100 border-green-200';
            case 'denied':
                return 'text-red-600 bg-red-100 border-red-200';
            case 'pending':
            default:
                return 'text-yellow-600 bg-yellow-100 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'denied':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'pending':
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <TravelBooking />
            {/* Hero Section */}
            
            <section className="relative py-16 px-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Manage Your Booking
                        </h1>
                        <p className="text-xl text-gray-600 max-w-6xl mx-auto">
                            View and track your refund requests and booking status in one place.
                        </p>
                    </div>

                    {/* Refresh Button */}
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={refreshData}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh Status
                        </button>
                    </div>

                    {/* Refund Requests Section */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                            Your Refund Requests
                        </h2>

                        {refunds.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No refund requests found</h3>
                                <p className="text-gray-500">Submit a refund request to track its status here</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {refunds.map((refund) => (
                                    <div
                                        key={refund.id}
                                        className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                    Refund Request #{refund.id}
                                                </h3>
                                                <p className="text-gray-600">
                                                    Submitted on {formatDate(refund.submittedAt || refund.RefundDate)}
                                                </p>
                                            </div>

                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getStatusColor(refund.status || 'pending')}`}>
                                                {getStatusIcon(refund.status || 'pending')}
                                                <span className="font-semibold capitalize">
                                                    {refund.status || 'pending'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        Ticket Number
                                                    </label>
                                                    <p className="text-gray-900 text-lg">{refund.TicketNumber}</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        Refund Date
                                                    </label>
                                                    <p className="text-gray-900">{formatDate(refund.RefundDate)}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        Account Number
                                                    </label>
                                                    <p className="text-gray-900 text-lg">{refund.AccountNumber}</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        Last Updated
                                                    </label>
                                                    <p className="text-gray-900">{formatDate(refund.submittedAt || refund.RefundDate)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Refund Description
                                            </label>
                                            <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">
                                                {refund.RefundDescription}
                                            </p>
                                        </div>

                                        {/* Status Messages */}
                                        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-blue-800 font-semibold">
                                                        {refund.status === 'approved'
                                                            ? 'Your refund has been approved! 💰'
                                                            : refund.status === 'denied'
                                                                ? 'Your refund request has been denied'
                                                                : 'Your refund request is under review'}
                                                    </p>
                                                    <p className="text-blue-600 text-sm mt-1">
                                                        {refund.status === 'approved'
                                                            ? 'The refund amount will be processed to your account within 3-5 business days.'
                                                            : refund.status === 'denied'
                                                                ? 'Please contact customer service for more information.'
                                                                : 'Our team will review your request and update the status soon.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    

                    {/*  */}
                    {/* Quick Actions */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">New Booking</h4>
                <p className="text-gray-600 mb-4">Book a new bus trip</p>
                <Link 
                  to="/ticket" 
                  className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold"
                >
                  Book Now
                </Link>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Refresh Status</h4>
                <p className="text-gray-600 mb-4">Check for latest updates</p>
                <button 
                  onClick={() => setLastUpdated(Date.now())}
                  className="inline-block bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 font-semibold"
                >
                  Refresh
                </button>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Request Refund</h4>
                <p className="text-gray-600 mb-4">Submit a refund request</p>
                <Link 
                  to="/refund" 
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold"
                >
                  Refund
                </Link>
              </div>
            </div>
          </div>
                </div>
            </section>
            
        </div>
    );
}

export default ManageBooking;