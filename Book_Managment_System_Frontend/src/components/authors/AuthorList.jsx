import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Pagination from '../common/Pagination';
import Spinner from '../common/Spinner';

/**
 * Component for displaying a list of authors
 */
const AuthorList = ({
  authors = [],
  loading = false,
  error = null,
  onDelete,
  pagination = null,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading authors</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authors.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No authors found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new author.</p>
        <div className="mt-6">
          <Link to="/authors/new">
            <Button>
              <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Author
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <Card key={author.id} className="h-full flex flex-col">
            <h3 className="text-lg font-semibold">{`${author.firstName} ${author.lastName}`}</h3>
            
            {author.birthDate && (
              <p className="text-sm text-gray-600 mt-1">
                Born: {new Date(author.birthDate).toLocaleDateString()}
              </p>
            )}
            
            {author.biography && (
              <div className="mt-2 text-sm text-gray-600 flex-grow line-clamp-3">
                {author.biography}
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => window.location.href = `/authors/edit/${author.id}`}
              >
                Edit
              </Button>
              
              <Button 
                variant="danger" 
                size="small" 
                onClick={() => {
                  if (window.confirm(`Delete ${author.firstName} ${author.lastName}?`)) {
                    onDelete(author.id);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

AuthorList.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      biography: PropTypes.string,
      birthDate: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
  }),
  onPageChange: PropTypes.func,
};

export default AuthorList;