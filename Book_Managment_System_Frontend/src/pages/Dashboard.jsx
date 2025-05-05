import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Books" className="text-center">
          <div className="text-4xl font-bold text-blue-600">{stats.totalBooks}</div>
        </Card>
        
        <Card title="Genres" className="text-center">
          <div className="text-4xl font-bold text-green-600">{stats.genres}</div>
        </Card>
        
        <Card title="Low Stock" className="text-center">
          <div className="text-4xl font-bold text-red-600">{stats.lowStock}</div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card 
          title="Recent Books"
          footer={
            <Link to="/books" className="text-blue-600 hover:underline">
              View All Books
            </Link>
          }
        >
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error loading books</p>
          ) : books.length === 0 ? (
            <p>No books available</p>
          ) : (
            <ul className="divide-y">
              {books.slice(0, 5).map(book => (
                <li key={book.bookId} className="py-2">
                  <Link to={`/books/${book.bookId}`} className="hover:text-blue-600">
                    <span className="font-medium">{book.title}</span>
                    <span className="text-gray-500 ml-2">- {book.genre}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        
        <Card 
          title="Quick Actions"
        >
          <div className="space-y-3">
            <Link to="/books/new" className="block w-full">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                Add New Book
              </button>
            </Link>
            
            <Link to="/books/search" className="block w-full">
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                Search Books
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;