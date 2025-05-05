import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';

const BookDetails = ({ book, loading, error, onDelete }) => {
  if (loading) {
    return <Spinner />;
  }
  
  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        Error: {error}
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500">Book not found</h3>
        <Link to="/books" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to Books
        </Link>
      </div>
    );
  }
  
  return (
    <Card
      title={book.title}
      subtitle={`Genre: ${book.genre}`}
      footer={
        <div className="flex space-x-2 justify-end">
          <Link to="/books">
            <Button variant="secondary">Back to List</Button>
          </Link>
          <Link to={`/books/${book.bookId}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Book Details</h4>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
              <p><span className="font-medium">Publication Date:</span> {book.publicationDate}</p>
              <p><span className="font-medium">Pages:</span> {book.pages}</p>
              <p><span className="font-medium">Price:</span> ${book.price.toFixed(2)}</p>
              <p><span className="font-medium">In Stock:</span> {book.quantity}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Author & Publisher</h4>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Author ID:</span> {book.authorId}</p>
              <p><span className="font-medium">Publisher ID:</span> {book.publisherId}</p>
            </div>
          </div>
        </div>
        
        {book.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="mt-2">{book.description}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BookDetails;