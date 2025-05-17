import { useState, useEffect } from 'react';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook, searchBooks } from '../api/booksApi';

export const useBooks = (initialPage = 1, initialLimit = 10) => {
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalBooks, setTotalBooks] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  // Fetch all books
  const fetchBooks = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllBooks(page, limit);
      setBooks(response.books || []);
      setTotalBooks(response.total || 0);
      setPage(page);
      setLimit(limit);
    } catch (err) {
      setError(err.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  // Fetch book by ID
  const fetchBookById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const book = await getBookById(id);
      setCurrentBook(book);
      return book;
    } catch (err) {
      setError(err.message || 'Failed to fetch book');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new book
  const addBook = async (bookData) => {
    setLoading(true);
    setError(null);
    try {
      const newBook = await createBook(bookData);
      setBooks((prevBooks) => [...prevBooks, newBook]);
      return newBook;
    } catch (err) {
      setError(err.message || 'Failed to create book');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update book
  const editBook = async (id, bookData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBook = await updateBook(id, bookData);
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.bookId === id ? updatedBook : book))
      );
      return updatedBook;
    } catch (err) {
      setError(err.message || 'Failed to update book');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete book
  const removeBook = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteBook(id);
      setBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete book');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Search books
  const searchForBooks = async (query, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchBooks(query, page, limit);
      setBooks(response.books || []);
      setTotalBooks(response.total || 0);
      setPage(page);
      setLimit(limit);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to search books');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load books on initial render
  useEffect(() => {
    fetchBooks(initialPage, initialLimit);
  }, [initialPage, initialLimit]);

  return {
    books,
    currentBook,
    loading,
    error,
    totalBooks,
    page,
    limit,
    fetchBooks,
    fetchBookById,
    addBook,
    editBook,
    removeBook,
    searchForBooks,
    setPage,
    setLimit,
  };
};