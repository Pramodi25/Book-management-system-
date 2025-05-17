import { useState } from 'react';
import { createAuthor } from '../api/authorsApi';
import { v4 as uuidv4 } from 'uuid';

export const useAuthors = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create new author
  const addAuthor = async (authorData) => {
    setLoading(true);
    setError(null);
    try {
      // Add UUID if not provided
      if (!authorData.authorId) {
        authorData.authorId = uuidv4();
      }
      const newAuthor = await createAuthor(authorData);
      return newAuthor;
    } catch (err) {
      setError(err.message || 'Failed to create author');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addAuthor
  };
};