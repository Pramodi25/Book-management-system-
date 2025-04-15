import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Books</h3>
            <p>0</p>
          </div>
          <div className="stat-card">
            <h3>Available Books</h3>
            <p>0</p>
          </div>
          <div className="stat-card">
            <h3>Borrowed Books</h3>
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;