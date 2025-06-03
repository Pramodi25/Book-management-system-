import React from 'react';
import TestPage from './pages/TestPage';
import './styles/global.css';

console.log('App.jsx loaded - direct render');

const App = () => {
  console.log('App component rendering - direct render');
  
  // Directly render the TestPage component without any routing
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">Book Management System</h1>
      <TestPage />
    </div>
  );
};

export default App;