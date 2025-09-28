import { useContext, useState, useEffect } from "react";
import { RefundContext } from "../Context/RefundContext";

function Supervisor() {
  const { allRefunds, updateRefundStatus } = useContext(RefundContext);
  const [refunds, setRefunds] = useState([]);

  // Load refunds from localStorage on component mount
  useEffect(() => {
    const savedRefunds = JSON.parse(localStorage.getItem('refunds') || '[]');
    setRefunds(savedRefunds);
  }, []);

  // Update local state when allRefunds changes
  useEffect(() => {
    if (allRefunds && allRefunds.length > 0) {
      setRefunds(allRefunds);
    }
  }, [allRefunds]);

  const handleDecision = (id, decision) => {
    // Update the context first
    if (updateRefundStatus) {
      updateRefundStatus(id, decision);
    }
    
    // Then update local state
    const updatedRefunds = refunds.map(refund => 
      refund.id === id ? { ...refund, status: decision } : refund
    );
    setRefunds(updatedRefunds);
    
    // Force localStorage update
    localStorage.setItem('refunds', JSON.stringify(updatedRefunds));
    
    // Show confirmation message
    alert(`Refund #${id} has been ${decision === 'approved' ? 'approved' : 'denied'}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Supervisor Dashboard</h1>
          <p className="text-xl text-gray-600">Manage and review refund requests</p>
        </div>
        
        {refunds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No refund requests yet</h3>
            <p className="text-gray-500">Refund requests will appear here once submitted</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {refunds.map(refund => (
              <div key={refund.id} className={`
                bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-300
                ${refund.status === 'approved' ? 'border-green-500 bg-green-50' : 
                  refund.status === 'denied' ? 'border-red-500 bg-red-50' : 
                  'border-gray-200 hover:shadow-xl'}
              `}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Refund #{refund.id}</h3>
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-semibold
                    ${refund.status === 'approved' ? 'bg-green-500 text-white' : 
                      refund.status === 'denied' ? 'bg-red-500 text-white' : 
                      'bg-yellow-500 text-white'}
                  `}>
                    {refund.status || 'pending'}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Refund Date</label>
                    <p className="text-gray-900">{formatDate(refund.RefundDate)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Ticket Number</label>
                      <p className="text-gray-900">{refund.TicketNumber}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Account Number</label>
                      <p className="text-gray-900">{refund.AccountNumber}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Description</label>
                    <p className="text-gray-900">{refund.RefundDescription}</p>
                  </div>
                  
                  {refund.submittedAt && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Submitted</label>
                      <p className="text-gray-600 text-sm">{formatDate(refund.submittedAt)}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleDecision(refund.id, "approved")}
                    disabled={refund.status === 'approved'}
                    className={`
                      flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-200
                      ${refund.status === 'approved' 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'}
                    `}
                  >
                    {refund.status === 'approved' ? 'Approved' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => handleDecision(refund.id, "denied")}
                    disabled={refund.status === 'denied'}
                    className={`
                      flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-200
                      ${refund.status === 'denied' 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'}
                    `}
                  >
                    {refund.status === 'denied' ? 'Denied' : 'Deny'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Supervisor;