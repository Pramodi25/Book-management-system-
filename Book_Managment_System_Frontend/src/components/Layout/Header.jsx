import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            📚 Book Management System
          </Link>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search books..."
            className="search-input"
          />
        </div>
        <nav className="nav-links">
          <Link to="/books/new" className="add-button">
            Add Book
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;