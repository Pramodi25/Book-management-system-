import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';

const BookItem = ({ book, onDelete }) => {
  return (
    <Card
      title={book.title}
      subtitle={`Genre: ${book.genre}`}
      footer={
        <div className="flex justify-between items-center">
          <div className="text-gray-700 font-medium">
            ${book.price.toFixed(2)}
          </div>
          <div className="space-x-2">
            <Link to={`/books/${book.bookId}`}>
              <Button size="sm" variant="secondary">
                View
              </Button>
            </Link>
            <Link to={`/books/${book.bookId}/edit`}>
              <Button size="sm" variant="primary">
                Edit
              </Button>
            </Link>
            <Button size="sm" variant="danger" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
        <p className="text-sm text-gray-500">Published: {book.publicationDate}</p>
        <p className="text-sm text-gray-500">Pages: {book.pages}</p>
        <p className="text-sm text-gray-500">Stock: {book.quantity} available</p>
        {book.description && (
          <p className="text-sm mt-2 line-clamp-3">{book.description}</p>
        )}
      </div>
    </Card>
  );
};

export default BookItem;