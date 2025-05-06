import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BookList from '../components/books/BookList';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useBooks } from '../hooks/useBooks';

const BooksPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  
  const { 
    books, 
    loading, 
    error, 
    totalBooks,
    page,
    limit,
    fetchBooks,
    removeBook,
    searchForBooks,
  } = useBooks();
  
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query) {
      searchForBooks(query, 1, limit);
    } else {
      fetchBooks(1, limit);
    }
  }, [searchForBooks, fetchBooks, limit]);
  
  const handlePageChange = useCallback((newPage) => {
    if (searchQuery) {
      searchForBooks(searchQuery, newPage, limit);
    } else {
      fetchBooks(newPage, limit);
    }
  }, [searchQuery, searchForBooks, fetchBooks, limit]);
  
  const handleDeleteClick = useCallback((bookId) => {
    setBookToDelete(bookId);
    setDeleteModalOpen(true);
  }, []);
  
  const confirmDelete = useCallback(async () => {
    if (bookToDelete) {
      await removeBook(bookToDelete);
      setDeleteModalOpen(false);
      setBookToDelete(null);
      
      // Refresh books list
      if (searchQuery) {
        searchForBooks(searchQuery, page, limit);
      } else {
        fetchBooks(page, limit);
      }
    }
  }, [bookToDelete, removeBook, searchQuery, searchForBooks, fetchBooks, page, limit]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Books</h1>
        <Button onClick={() => navigate('/books/new')}>Add New Book</Button>
      </div>
      
      <BookList
        books={books}
        loading={loading}
        error={error}
        totalBooks={totalBooks}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onDelete={handleDeleteClick}
      />
      
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete this book? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default BooksPage;