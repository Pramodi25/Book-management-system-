import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookForm from '../components/books/BookForm';
import { useBooks } from '../hooks/useBooks';

const BookEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBook, loading, error, fetchBookById, editBook, addBook } = useBooks();
  const [initializing, setInitializing] = useState(true);
  
  useEffect(() => {
    const loadBook = async () => {
      if (id && id !== 'new') {
        await fetchBookById(id);
      }
      setInitializing(false);
    };
    
    loadBook();
  }, [id, fetchBookById]);
  
  const handleSubmit = async (bookData) => {
    let success;
    
    if (id === 'new') {
      success = await addBook(bookData);
    } else {
      success = await editBook(id, bookData);
    }
    
    if (success) {
      navigate(`/books/${success.bookId}`);
    }
  };
  
  const pageTitle = id === 'new' ? 'Add New Book' : 'Edit Book';
  
  if (initializing) {
    return <div>Loading...</div>;
  }
  
  if (error && id !== 'new') {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        Error: {error}
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>
      
      <BookForm
        initialData={id === 'new' ? null : currentBook}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default BookEditPage;