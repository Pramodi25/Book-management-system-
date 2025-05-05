import React from 'react';
import { RouterProvider } from 'react-router-dom';
import AppRoutes from './routes';
import './styles/global.css';

const App = () => {
  return <RouterProvider router={AppRoutes} />;
};

export default App;