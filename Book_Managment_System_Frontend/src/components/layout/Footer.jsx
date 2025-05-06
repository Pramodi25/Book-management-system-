import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary-navy text-primary-lavender border-t border-primary-mauve py-6">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-primary-lavender text-sm">
              &copy; {new Date().getFullYear()} Book Management System
            </span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-primary-lavender hover:text-primary-peach transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-primary-lavender hover:text-primary-peach transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-lavender hover:text-primary-peach transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;