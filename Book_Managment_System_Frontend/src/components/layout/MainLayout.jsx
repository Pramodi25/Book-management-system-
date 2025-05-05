import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Book Management System
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;