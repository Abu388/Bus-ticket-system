import React from "react";

const types = [
  {
    id: 1,
    name: "Selam Bus",
    description:
      "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
    print: 800,
    image:
      "https://image.made-in-china.com/202f0j00NnUhFpCalKqc/Cheap-Used-Yellow-Yutong-Bus-Car-6122-and-40-Seats-Used-Coach-Tourist-Bus.webp",
    trips: 120,
    passengers: "Business, Student",
    location: "Addis Ababa - Gondar",
  },
  {
    id: 2,
    name: "Zemen Bus",
    description:
      "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
    print: 900,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9fQLF3FWfBaB9A5o_H6Jts7X_hMN9K0LxPw&s",
    trips: 90,
    passengers: "Tourist, Business",
    location: "Addis Ababa - Bahir Dar",
  },
  {
    id: 3,
    name: "Sky Bus",
    description:
      "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
    print: 750,
    image:
      "https://img.12go.asia/0/fit/0/320/ce/0/plain/s3://12go-web-static/static/images/operator/13152/class/29-outside.jpg",
    trips: 60,
    passengers: "Student, Tourist",
    location: "Addis Ababa - Mekelle",
  },
  {
    id: 4,
    name: "Golden Bus",
    description:
      "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
    print: 630,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0sYLsr8S0vi9NJMXBuvBd1vMMSnWMuJNxIA&s",
    trips: 110,
    passengers: "Business, Tourist",
    location: "Addis Ababa - Hawassa",
  },
  {
    id: 5,
    name: "Liyu Bus",
    description:
      "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
    print: 850,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMrj-LwqW97gsz0WGOovX2huKspBl_apaFpA&s",
    trips: 95,
    passengers: "Student, Business",
    location: "Addis Ababa - Dire Dawa",
  },
];

// Sample data for charts
const revenueData = [
  { month: "Jan", revenue: 125000 },
  { month: "Feb", revenue: 145000 },
  { month: "Mar", revenue: 132000 },
  { month: "Apr", revenue: 158000 },
  { month: "May", revenue: 172000 },
  { month: "Jun", revenue: 195000 },
];

const tripData = [
  { name: "Selam Bus", trips: 120 },
  { name: "Zemen Bus", trips: 90 },
  { name: "Sky Bus", trips: 60 },
  { name: "Golden Bus", trips: 110 },
  { name: "Liyu Bus", trips: 95 },
];

const passengerTypeData = [
  { type: "Business", count: 45 },
  { type: "Student", count: 30 },
  { type: "Tourist", count: 25 },
];

function Head() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {/* Dashboard Summary Cards */}
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p className="summary-value">ETB 927,000</p>
          <p className="summary-change">+12% from last month</p>
        </div>
        <div className="summary-card">
          <h3>Total Trips</h3>
          <p className="summary-value">475</p>
          <p className="summary-change">+8% from last month</p>
        </div>
        <div className="summary-card">
          <h3>Total Passengers</h3>
          <p className="summary-value">12,340</p>
          <p className="summary-change">+15% from last month</p>
        </div>
        <div className="summary-card">
          <h3>Occupancy Rate</h3>
          <p className="summary-value">78%</p>
          <p className="summary-change">+5% from last month</p>
        </div>
      </div>
      
      {/* Graphical Data Section */}
      <div className="charts-section">
        <h2>Performance Analytics</h2>
        
        <div className="charts-grid">
          {/* Revenue Chart */}
          <div className="chart-container">
            <h3>Monthly Revenue</h3>
            <div className="bar-chart">
              {revenueData.map((item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-label">{item.month}</div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ height: `${(item.revenue / 200000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">ETB {item.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Trip Distribution Chart */}
          <div className="chart-container">
            <h3>Trips by Bus</h3>
            <div className="doughnut-chart">
              {tripData.map((item, index) => {
                const percentage = (item.trips / 475) * 100;
                const color = `hsl(${index * 70}, 70%, 50%)`;
                return (
                  <div key={index} className="doughnut-segment">
                    <div 
                      className="segment" 
                      style={{
                        backgroundColor: color,
                        width: `${percentage}%`
                      }}
                    ></div>
                    <div className="doughnut-label">
                      <span className="color-indicator" style={{backgroundColor: color}}></span>
                      {item.name}: {item.trips} trips
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Passenger Type Chart */}
          <div className="chart-container">
            <h3>Passenger Distribution</h3>
            <div className="pie-chart">
              {passengerTypeData.map((item, index) => {
                const percentage = (item.count / 100) * 100;
                const color = `hsl(${index * 120}, 70%, 50%)`;
                return (
                  <div key={index} className="pie-item">
                    <div className="pie-segment">
                      <div 
                        className="segment-fill"
                        style={{
                          backgroundColor: color,
                          width: `${percentage}%`
                        }}
                      ></div>
                    </div>
                    <div className="pie-label">
                      <span className="color-indicator" style={{backgroundColor: color}}></span>
                      {item.type}: {item.count}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Your existing bus grid */}
      <h2>Bus Fleet Management</h2>
      <div className="bus-grid">
        {types.map((bus) => (
          <div key={bus.id} className="bus-card">
            <div className="bus-image-container">
              <img src={bus.image} alt={bus.name} className="bus-image" />
              <div className="bus-badge">{bus.name}</div>
            </div>
            <div className="bus-content">
              <h3>{bus.name}</h3>
              <p className="bus-description">{bus.description}</p>
              <p><strong>Trips:</strong> {bus.trips}</p>
              <p><strong>Passenger Types:</strong> {bus.passengers}</p>
              <p><strong>Route:</strong> {bus.location}</p>
              <p><strong>Print Price:</strong> {bus.print} ETB</p>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
        .admin-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
          background: #f8fafc;
        }
        h1 {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 40px;
          color: #1e293b;
        }
        h2 {
          font-size: 1.8rem;
          margin: 40px 0 20px;
          color: #1e293b;
        }
        h3 {
          font-size: 1.2rem;
          margin-bottom: 15px;
          color: #334155;
        }
        
        /* Summary Cards */
        .dashboard-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 40px;
        }
        .summary-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: center;
        }
        .summary-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #3b82f6;
          margin: 10px 0;
        }
        .summary-change {
          font-size: 0.9rem;
          color: #10b981;
          margin: 0;
        }
        
        /* Charts Section */
        .charts-section {
          margin-bottom: 40px;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        /* Bar Chart */
        .bar-chart {
          display: flex;
          align-items: flex-end;
          height: 200px;
          gap: 15px;
          padding-top: 20px;
        }
        .bar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        .bar-track {
          height: 150px;
          width: 30px;
          background: #e2e8f0;
          border-radius: 4px 4px 0 0;
          position: relative;
          overflow: hidden;
        }
        .bar-fill {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: #3b82f6;
          border-radius: 4px 4px 0 0;
          transition: height 0.5s ease;
        }
        .bar-label, .bar-value {
          font-size: 0.8rem;
          margin-top: 8px;
          text-align: center;
          color: #64748b;
        }
        
        /* Doughnut and Pie Charts */
        .doughnut-chart, .pie-chart {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 15px;
        }
        .doughnut-segment, .pie-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .segment {
          height: 20px;
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        .pie-segment {
          width: 50px;
          height: 20px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }
        .segment-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease;
        }
        .doughnut-label, .pie-label {
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .color-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
        
        /* Your existing bus grid styles */
        .bus-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .bus-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }
        .bus-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }
        .bus-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        .bus-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .bus-card:hover .bus-image {
          transform: scale(1.05);
        }
        .bus-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(59, 130, 246, 0.9);
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .bus-content {
          padding: 1.5rem;
        }
        .bus-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.75rem;
        }
        .bus-description {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .bus-content p {
          font-size: 0.9rem;
          color: #334155;
          margin: 0.25rem 0;
        }
        @media (max-width: 768px) {
          .bus-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}
      </style>
    </div>
  );
}

export default Head;