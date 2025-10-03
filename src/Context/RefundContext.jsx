import { createContext, useState, useEffect } from "react";

export const RefundContext = createContext();

export function RefundProvider({ children }) {
  const [refundData, setRefundData] = useState(null);
  const [allRefunds, setAllRefunds] = useState([]);

  // Load refunds from localStorage on component mount
  useEffect(() => {
    const savedRefunds = JSON.parse(localStorage.getItem('refunds') || '[]');
    setAllRefunds(savedRefunds);
    
    // If there's a current refund in localStorage, set it
    const currentRefund = JSON.parse(localStorage.getItem('currentRefund') || 'null');
    if (currentRefund) {
      setRefundData(currentRefund);
    }
  }, []);

  // Save to localStorage whenever allRefunds change
  useEffect(() => {
    localStorage.setItem('refunds', JSON.stringify(allRefunds));
  }, [allRefunds]);

  // Save current refund to localStorage whenever it changes
  useEffect(() => {
    if (refundData) {
      localStorage.setItem('currentRefund', JSON.stringify(refundData));
    }
  }, [refundData]);

  const addRefund = (refund) => {
    const newRefund = {
      ...refund,
      id: Date.now(), // Simple ID generation
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setAllRefunds(prev => [...prev, newRefund]);
    setRefundData(newRefund);
  };

  const updateRefundStatus = (id, status) => {
    setAllRefunds(prev => 
      prev.map(refund => 
        refund.id === id ? { ...refund, status } : refund
      )
    );
    
    // Also update the current refund data if it's the one being modified
    if (refundData && refundData.id === id) {
      const updatedRefund = { ...refundData, status };
      setRefundData(updatedRefund);
    }
  };

  return (
    <RefundContext.Provider value={{ 
      refundData, 
      setRefundData, 
      allRefunds, 
      addRefund, 
      updateRefundStatus 
    }}>
      {children}
    </RefundContext.Provider>
  );
}