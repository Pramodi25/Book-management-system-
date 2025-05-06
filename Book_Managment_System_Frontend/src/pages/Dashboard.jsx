// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useBooks } from '../hooks/useBooks';

const Dashboard = () => {
  const { books, loading, error, totalBooks } = useBooks(1, 5);
  const [stats, setStats] = useState({
    totalBooks: 0,
    lowStock: 0,
    genres: 0
  });

  useEffect(() => {
    if (books.length > 0) {
      // Calculate statistics
      const genres = new Set(books.map(book => book.genre)).size;
      const lowStock = books.filter(book => book.quantity < 5).length;
      
      setStats({
        totalBooks: totalBooks || books.length,
        lowStock,
        genres
      });
    }
  }, [books, totalBooks]);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-navy mb-2">Dashboard</h1>
        <p className="text-primary-mauve">Welcome to your Book Management System</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
        <StatsCard 
          title="Total Books" 
          value={stats.totalBooks} 
          icon={<BookIcon />} 
          color="purple"
        />
        
        <StatsCard 
          title="Genres" 
          value={stats.genres} 
          icon={<CategoryIcon />} 
          color="peach"
        />
        
        <StatsCard 
          title="Low Stock" 
          value={stats.lowStock} 
          icon={<AlertIcon />} 
          color="navy"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 w-full">
        {/* Recent Books */}
        <Card 
          title="Recent Books"
          icon={<ClockIcon />}
          className="lg:col-span-2"
          cardType="primary"
          isLoading={loading}
          footer={
            <Link to="/books" className="text-primary-purple hover:text-primary-peach font-medium flex items-center">
              View All Books
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          }
        >
          {error ? (
            <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">
              Error loading books: {error}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-primary-mauve mb-4">No books available</p>
              <Button 
                as={Link} 
                to="/books/new" 
                variant="primary"
                size="sm"
                icon={<PlusIcon />}
              >
                Add First Book
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-primary-lavender divide-opacity-20">
              {books.slice(0, 5).map(book => (
                <Link
                  key={book.bookId}
                  to={`/books/${book.bookId}`}
                  className="block py-3 px-2 -mx-2 rounded-lg hover:bg-primary-lavender hover:bg-opacity-10 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-primary-navy">{book.title}</h3>
                      <p className="text-sm text-primary-mauve">
                        {book.genre} • {book.quantity} in stock
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-primary-peach">
                      ${book.price.toFixed(2)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
        
        {/* Quick Actions */}
        <Card
          title="Quick Actions"
          icon={<LightningIcon />}
          cardType="peach"
        >
          <div className="space-y-3">
            <Link to="/books/new" className="block w-full">
              <Button
                fullWidth
                variant="primary"
                className="justify-start"
                icon={<PlusIcon />}
              >
                Add New Book
              </Button>
            </Link>
            
            <Link to="/books" className="block w-full">
              <Button
                fullWidth
                variant="light"
                className="justify-start"
                icon={<SearchIcon />}
              >
                Search Books
              </Button>
            </Link>
            
            <Link to="/authors" className="block w-full">
              <Button
                fullWidth
                variant="light"
                className="justify-start"
                icon={<UserIcon />}
              >
                Add Author
              </Button>
            </Link>
            
            <Link to="/publishers" className="block w-full">
              <Button
                fullWidth
                variant="light"
                className="justify-start"
                icon={<BuildingIcon />}
              >
                Add Publisher
              </Button>
            </Link>
          </div>
        </Card>
      </div>
      
      {/* System Status Section */}
      <Card
        title="System Status"
        subtitle="Current system parameters and status"
        icon={<ServerIcon />}
        cardType="navy"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusItem title="API Status" value="Operational" status="success" />
            <StatusItem title="Database" value="Connected" status="success" />
            <StatusItem title="Last Update" value="Just now" status="info" />
          </div>
        </div>
      </Card>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color = 'purple' }) => {
  const colorClasses = {
    purple: 'bg-primary-purple bg-opacity-10 text-primary-purple',
    peach: 'bg-primary-peach bg-opacity-10 text-primary-peach',
    navy: 'bg-primary-navy bg-opacity-10 text-primary-navy',
    mauve: 'bg-primary-mauve bg-opacity-10 text-primary-mauve',
    lavender: 'bg-primary-lavender bg-opacity-20 text-primary-purple',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
  };
  
  const textColorClasses = {
    purple: 'text-primary-purple',
    peach: 'text-primary-peach',
    navy: 'text-primary-navy',
    mauve: 'text-primary-mauve',
    lavender: 'text-primary-lavender',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-primary-mauve">{title}</h2>
            <div className={`text-3xl font-bold ${textColorClasses[color]}`}>
              {value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Status Item Component
const StatusItem = ({ title, value, status }) => {
  const statusClasses = {
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-primary-lavender bg-opacity-20 text-primary-purple',
  };
  
  const dotClasses = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-primary-purple',
  };
  
  return (
    <div className={`p-4 rounded-lg ${statusClasses[status]}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center">
          <span className={`h-2 w-2 rounded-full ${dotClasses[status]} mr-2`}></span>
          <span>{value}</span>
        </div>
      </div>
    </div>
  );
};

// Icon Components
const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LightningIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ServerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

export default Dashboard;