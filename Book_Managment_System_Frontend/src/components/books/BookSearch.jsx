import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const BookSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="flex-grow">
          <Input
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-0"
          />
        </div>
        <Button type="submit" disabled={!searchTerm.trim()}>
          Search
        </Button>
        {searchTerm && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => {
              setSearchTerm('');
              onSearch('');
            }}
          >
            Clear
          </Button>
        )}
      </form>
    </div>
  );
};

export default BookSearch;