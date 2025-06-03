import React from 'react';
import ReactDOM from 'react-dom/client';

// Creating a super simple app
const SimpleApp = () => {
  console.log('SimpleApp rendering');
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#4A3F88' }}>Book Vault Management System</h1>
      <p>This is a test page to see if React is working properly.</p>
      <button 
        style={{ 
          backgroundColor: '#E99E75', 
          color: 'white', 
          padding: '10px 16px', 
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => alert('UI is working!')}
      >
        Click to test UI
      </button>
    </div>
  );
};

// Render directly without any context providers or routers
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>
);
