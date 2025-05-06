import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-primary-peach to-primary-purple shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl"></span>
            <span className="text-white text-xl font-bold tracking-tight">Book Vault</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" isActive={isActiveRoute('/')}>
              Dashboard
            </NavLink>
            <NavLink to="/books" isActive={isActiveRoute('/books')}>
              Books
            </NavLink>
            <NavLink to="/books/new" isActive={isActiveRoute('/books/new')}>
              Add Book
            </NavLink>
            <NavLink to="/authors" isActive={isActiveRoute('/authors')}>
              Authors
            </NavLink>
            <NavLink to="/publishers" isActive={isActiveRoute('/publishers')}>
              Publishers
            </NavLink>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 py-3 border-t border-primary-lavender space-y-3">
            <MobileNavLink to="/" isActive={isActiveRoute('/')} onClick={() => setIsMobileMenuOpen(false)}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink to="/books" isActive={isActiveRoute('/books')} onClick={() => setIsMobileMenuOpen(false)}>
              Books
            </MobileNavLink>
            <MobileNavLink to="/books/new" isActive={isActiveRoute('/books/new')} onClick={() => setIsMobileMenuOpen(false)}>
              Add Book
            </MobileNavLink>
            <MobileNavLink to="/authors" isActive={isActiveRoute('/authors')} onClick={() => setIsMobileMenuOpen(false)}>
              Authors
            </MobileNavLink>
            <MobileNavLink to="/publishers" isActive={isActiveRoute('/publishers')} onClick={() => setIsMobileMenuOpen(false)}>
              Publishers
            </MobileNavLink>
          </nav>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ to, isActive, children }) => (
  <Link
    to={to}
    className={`${
      isActive 
        ? 'text-white font-semibold border-b-2 border-primary-peach pb-1' 
        : 'text-primary-lavender hover:text-white hover:border-b-2 hover:border-primary-lavender pb-1'
    } transition-all duration-200`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, isActive, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block ${
      isActive 
        ? 'text-white font-medium bg-primary-navy rounded-md px-3 py-2' 
        : 'text-primary-lavender hover:bg-primary-mauve hover:text-white rounded-md px-3 py-2'
    } transition-all duration-200`}
  >
    {children}
  </Link>
);

export default Header;
