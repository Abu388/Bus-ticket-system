import React, { useState } from "react";

function Refund() {
  const [refundId, setRefundId] = useState("");
  const [refundDescription, setRefundDescription] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if both fields are filled
    if (refundId.trim() && refundDescription.trim()) {
      setShowAlert(true);
      
      // Hide the alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      // You can add your form submission logic here
    }
  };

  return (
    <div>
      <section className="header">
        <h1>Refund Request</h1>
        <p>Submit your refund details below to process your request.</p>
      </section>
      
      {/* Alert message */}
      {showAlert && (
        <div className="alert">
          Your request is being processed...
        </div>
      )}
      
      <section className="refund-form">
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="refundId">Refund ID</label>
            <input
              type="text"
              name="refundId"
              id="refundId"
              placeholder="Enter Refund ID"
              className="form-input"
              value={refundId}
              onChange={(e) => setRefundId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="refundDescription">Refund Description</label>
            <textarea
              name="refundDescription"
              id="refundDescription"
              placeholder="Enter Refund description"
              className="form-textarea"
              value={refundDescription}
              onChange={(e) => setRefundDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Submit Refund
          </button>
        </form>
      </section>

      {/* Inline CSS */}
      <style>
        {`
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f8fafc;
          }

          /* Alert Styles */
          .alert {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #10b981, #34d399);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          /* Header Section */
          .header {
            background: linear-gradient(45deg, #2563eb, #3b82f6);
            color: white;
            text-align: center;
            padding: 60px 20px;
          }
          .header h1 {
            font-size: 2.75rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          .header p {
            font-size: 1.25rem;
            opacity: 0.9;
            margin-bottom: 1rem;
          }

          /* Refund Form Section */
          .refund-form {
            padding: 60px 20px;
            max-width: 600px;
            margin: 0 auto;
          }
          .form-container {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          }
          .form-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 1.5rem;
          }
          .form-group label {
            font-size: 1rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.5rem;
          }
          .form-input {
            padding: 12px 15px;
            font-size: 1rem;
            border: none;
            border-radius: 8px;
            outline: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.3s;
            width: 100%;
          }
          .form-input:focus {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .form-textarea {
            padding: 12px 15px;
            font-size: 1rem;
            border: none;
            border-radius: 8px;
            outline: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.3s;
            width: 100%;
            min-height: 150px; /* Increased height for longer input */
            resize: vertical; /* Allows vertical resizing only */
          }
          .form-textarea:focus {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .submit-button {
            background: linear-gradient(45deg, #10b981, #34d399);
            color: white;
            padding: 12px 20px;
            font-size: 1rem;
            font-weight: 600;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            width: 100%;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .submit-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
            background: linear-gradient(45deg, #059669, #22c55e);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .header h1 {
              font-size: 2rem;
            }
            .header p {
              font-size: 1.1rem;
            }
            .refund-form {
              padding: 40px 15px;
            }
            .form-container {
              padding: 1.5rem;
            }
            .alert {
              top: 10px;
              right: 10px;
              left: 10px;
              text-align: center;
            }
          }
          @media (max-width: 480px) {
            .header {
              padding: 40px 15px;
            }
            .form-input, .form-textarea, .submit-button {
              padding: 10px 15px;
              font-size: 0.9rem;
            }
            .form-textarea {
              min-height: 120px; /* Slightly smaller height for mobile */
            }
          }
        `}
      </style>
    </div>
  );
}

export default Refund;