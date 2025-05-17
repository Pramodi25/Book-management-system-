import { useState } from 'react';
import { createPublisher } from '../api/publishersApi';
import { v4 as uuidv4 } from 'uuid';

export const usePublishers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create new publisher
  const addPublisher = async (publisherData) => {
    setLoading(true);
    setError(null);
    try {
      // Add UUID if not provided
      if (!publisherData.publisherId) {
        publisherData.publisherId = uuidv4();
      }
      const newPublisher = await createPublisher(publisherData);
      return newPublisher;
    } catch (err) {
      setError(err.message || 'Failed to create publisher');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addPublisher
  };
};