import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import Pagination from '../common/Pagination';
import BookSearch from './BookSearch';
import BookItem from './BookItem';

const BookList = ({ 
  books = [], 
  loading, 
  error,
  totalBooks,
  page,
  limit,
  onPageChange,
  onSearch,
  onDelete
}) => {
  const totalPages = Math.ceil(totalBooks / limit);

  if (loading && books.length === 0) {
    return <Spinner className="mt-10" />;
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <BookSearch onSearch={onSearch} />
      </div>

      {books.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-500">No books found</h3>
          <p className="mt-2 text-gray-400">Try adjusting your search or add a new book</p>
          <Link 
            to="/books/new" 
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <BookItem 
              key={book.bookId} 
              book={book} 
              onDelete={() => onDelete(book.bookId)}
            />
          ))}
        </div>
      )}
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default BookList;