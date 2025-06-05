import React, { useState, useEffect } from 'react';
import api from './api';

const SimpleApp = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Test API connection by fetching books
        console.log('Fetching books from API...');
        const booksResponse = await api.get('/books');
        console.log('Books response:', booksResponse.data);
        setBooks(booksResponse.data.books || []);

        // Try to fetch authors
        console.log('Fetching authors from API...');
        const authorsResponse = await api.get('/authors');
        console.log('Authors response:', authorsResponse.data);
        setAuthors(authorsResponse.data.authors || []);

        // Try to fetch publishers
        console.log('Fetching publishers from API...');
        const publishersResponse = await api.get('/publishers');
        console.log('Publishers response:', publishersResponse.data);
        setPublishers(publishersResponse.data.publishers || []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Book Management System</h1>
        
        {loading && (
          <div className="p-4 bg-blue-100 rounded">
            <p>Loading data from API...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded mb-6">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <p className="mt-2 text-sm">Check if the backend server is running at http://localhost:8081</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 mt-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">Books</h2>
              {books.length > 0 ? (
                <ul className="divide-y">
                  {books.map((book) => (
                    <li key={book.bookId} className="py-3">
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No books found.</p>
              )}
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">Authors</h2>
              {authors.length > 0 ? (
                <ul className="divide-y">
                  {authors.map((author) => (
                    <li key={author.authorId} className="py-3">
                      <h3 className="font-medium">{author.name}</h3>
                      <p className="text-sm text-gray-600">{author.bio}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No authors found.</p>
              )}
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">Publishers</h2>
              {publishers.length > 0 ? (
                <ul className="divide-y">
                  {publishers.map((publisher) => (
                    <li key={publisher.publisherId} className="py-3">
                      <h3 className="font-medium">{publisher.name}</h3>
                      <p className="text-sm text-gray-600">{publisher.address}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No publishers found.</p>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">API Testing</h2>
          <div className="grid gap-4">
            <button 
              onClick={async () => {
                try {
                  const response = await api.get('/status');
                  alert(`Backend status: ${response.data}`);
                } catch (err) {
                  alert(`Error: ${err.message}`);
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test API Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleApp;