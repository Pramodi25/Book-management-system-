import React, { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import AppRoutes from './routes';
import './styles/global.css';
import SplashScreen from './components/common/SplashScreen';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Prevent scrolling when splash screen is shown
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return <RouterProvider router={AppRoutes} />;
};

export default App;