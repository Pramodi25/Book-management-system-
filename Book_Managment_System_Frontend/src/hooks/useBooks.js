import { useState, useEffect } from 'react';
import { bookService } from '../services';
import { useAppContext } from '../contexts/AppContext';

export const useBooks = (initialPage = 1, initialLimit = 10, fetchOnMount = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);
  const { state, actions } = useAppContext();
  
  // Extract books state from global context
  const books = state.books.data || [];
  const totalBooks = state.books.totalBooks || 0;
  const page = state.books.page || initialPage;
  const limit = state.books.limit || initialLimit;

  // Fetch all books using the global context and service layer
  const fetchBooks = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we should use cache from global state
      const now = Date.now();
      const cache = state.books.cache;
      
      if (
        cache.timestamp && 
        cache.data && 
        (now - cache.timestamp < cache.expiresIn) &&
        cache.data.page === page &&
        cache.data.limit === limit
      ) {
        // Use cached data
        setLoading(false);
        return { 
          books: state.books.data, 
          total: state.books.totalBooks 
        };
      }
      
      // Fetch from API using service
      const response = await bookService.getAll(page, limit);
      
      // Update global state
      actions.fetchBooksSuccess({
        books: response.books || [],
        total: response.total || 0,
        page,
        limit
      });
      
      setLoading(false);
      return response;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch books';
      setError(errorMsg);
      
      // Update global state with error
      actions.fetchBooksFailure(errorMsg);
      
      setLoading(false);
      throw err;
    }
  };

  // Fetch book by ID
  const fetchBookById = async (id) => {
    setLoading(true);
    setError(null);
    
    // First check if we have the book in our current state
    const cachedBook = books.find(book => book.bookId === id);
    if (cachedBook) {
      setCurrentBook(cachedBook);
      setLoading(false);
      return cachedBook;
    }
    
    try {
      const book = await bookService.getById(id);
      setCurrentBook(book);
      return book;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch book';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // Create new book
  const addBook = async (bookData) => {
    setLoading(true);
    setError(null);
    try {
      // Transform frontend bookData to match backend expectations
      console.log('Original book data from form:', bookData);
      
      const backendBookData = {
        bookId: bookData.bookId || null,
        authorId: bookData.authorId,
        publisherId: bookData.publisherId,
        title: bookData.title || '',
        publicationDate: bookData.publicationDate || '',
        isbn: bookData.isbn || '',
        pages: parseInt(bookData.pages) || 1,
        genre: bookData.genre || '',
        description: bookData.description || '',
        price: parseFloat(bookData.price) || 0,
        quantity: parseInt(bookData.quantity) || 0
      };
      
      console.log('Transformed book data for backend:', backendBookData);
      
      const newBook = await bookService.create(backendBookData);
      
      // Update global state
      actions.addBook(newBook);
      
      // Add success notification
      actions.addNotification({
        type: 'success',
        message: 'Book created successfully'
      });
      
      return newBook;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create book';
      setError(errorMsg);
      
      // Add error notification
      actions.addNotification({
        type: 'error',
        message: errorMsg
      });
      
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
      // Transform frontend bookData to match backend expectations
      console.log('Original book data for update:', bookData);
      
      const backendBookData = {
        bookId: id || bookData.bookId,
        authorId: bookData.authorId,
        publisherId: bookData.publisherId,
        title: bookData.title || '',
        publicationDate: bookData.publicationDate || '',
        isbn: bookData.isbn || '',
        pages: parseInt(bookData.pages) || 1,
        genre: bookData.genre || '',
        description: bookData.description || '',
        price: parseFloat(bookData.price) || 0,
        quantity: parseInt(bookData.quantity) || 0
      };
      
      console.log('Transformed book data for backend update:', backendBookData);
      
      const updatedBook = await bookService.update(id, backendBookData);
      
      // Update global state
      actions.updateBook(updatedBook);
      
      // Add success notification
      actions.addNotification({
        type: 'success',
        message: 'Book updated successfully'
      });
      
      return updatedBook;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update book';
      setError(errorMsg);
      
      // Add error notification
      actions.addNotification({
        type: 'error',
        message: errorMsg
      });
      
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
      await bookService.delete(id);
      
      // Update global state
      actions.deleteBook(id);
      
      // Add success notification
      actions.addNotification({
        type: 'success',
        message: 'Book deleted successfully'
      });
      
      return true;
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete book';
      setError(errorMsg);
      
      // Add error notification
      actions.addNotification({
        type: 'error',
        message: errorMsg
      });
      
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
      const response = await bookService.searchBooks(query, page, limit);
      
      // We don't update the global state here because search results
      // are temporary and don't replace the main book list
      
      return response;
    } catch (err) {
      const errorMsg = err.message || 'Failed to search books';
      setError(errorMsg);
      
      actions.addNotification({
        type: 'error',
        message: errorMsg
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Set page in global state
  const setPage = (newPage, newLimit) => {
    actions.setBooksPage(newPage, newLimit || limit);
  };

  // Load books on initial render if fetchOnMount is true
  useEffect(() => {
    if (fetchOnMount) {
      fetchBooks(initialPage, initialLimit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnMount, initialPage, initialLimit]);

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
    setPage
  };
};