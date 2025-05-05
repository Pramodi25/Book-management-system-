import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            📚 Book Management System
          </Link>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-white hover:text-blue-100">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-white hover:text-blue-100">
                  Books
                </Link>
              </li>
              <li>
                <Link to="/books/new" className="text-white hover:text-blue-100">
                  Add Book
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;