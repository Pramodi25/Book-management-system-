import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookDetails from '../components/books/BookDetails';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { useBooks } from '../hooks/useBooks';

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBook, loading, error, fetchBookById, removeBook } = useBooks();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchBookById(id);
    }
  }, [id, fetchBookById]);
  
  const handleDelete = async () => {
    await removeBook(id);
    setShowDeleteModal(false);
    navigate('/books');
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Book Details</h1>
      
      <BookDetails
        book={currentBook}
        loading={loading}
        error={error}
        onDelete={() => setShowDeleteModal(true)}
      />
      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
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

export default BookDetailsPage;