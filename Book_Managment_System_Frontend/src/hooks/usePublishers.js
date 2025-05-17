import { useState, useEffect } from 'react';
import { publisherService } from '../services';
import { useAppContext } from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';

export const usePublishers = (initialPage = 1, initialLimit = 10, fetchOnMount = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPublisher, setCurrentPublisher] = useState(null);
  const { state, actions } = useAppContext();
  
  // Extract publishers state from global context
  const publishers = state?.publishers?.data || [];
  const totalPublishers = state?.publishers?.totalPublishers || 0;
  const page = state?.publishers?.page || initialPage;
  const limit = state?.publishers?.limit || initialLimit;

  // Fetch all publishers using the global context and service layer
  const fetchPublishers = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we should use cache from global state
      const now = Date.now();
      const cache = state?.publishers?.cache || {};
      
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
          publishers: state.publishers.data, 
          total: state.publishers.totalPublishers 
        };
      }
      
      // Fetch from API using service
      const response = await publisherService.getAll(page, limit);
      
      // Update global state if actions exists
      if (actions && actions.fetchPublishersSuccess) {
        actions.fetchPublishersSuccess({
          publishers: response.publishers || [],
          total: response.total || 0,
          page,
          limit
        });
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch publishers';
      setError(errorMsg);
      
      // Update global state with error if actions exists
      if (actions && actions.fetchPublishersFailure) {
        actions.fetchPublishersFailure(errorMsg);
      }
      
      setLoading(false);
      throw err;
    }
  };

  // Fetch publisher by ID
  const fetchPublisherById = async (id) => {
    setLoading(true);
    setError(null);
    
    // First check if we have the publisher in our current state
    const cachedPublisher = publishers.find(publisher => publisher.publisherId === id);
    if (cachedPublisher) {
      setCurrentPublisher(cachedPublisher);
      setLoading(false);
      return cachedPublisher;
    }
    
    try {
      const publisher = await publisherService.getById(id);
      setCurrentPublisher(publisher);
      return publisher;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch publisher';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // Create new publisher
  const addPublisher = async (publisherData) => {
    setLoading(true);
    setError(null);
    try {
      // Generate UUID if not provided
      const publisherId = publisherData.publisherId || uuidv4();
      
      // Transform frontend publisher data to match backend structure
      // Note: backend uses snake_case for publisherId
      const backendPublisherData = {
        publisher_id: publisherId,
        name: publisherData.name || '',
        address: publisherData.location || publisherData.address || '',
      };
      
      const newPublisher = await publisherService.create(backendPublisherData);
      
      // Update global state if actions exists
      if (actions && actions.addPublisher) {
        actions.addPublisher(newPublisher);
        
        // Add success notification
        if (actions.addNotification) {
          actions.addNotification({
            type: 'success',
            message: 'Publisher created successfully'
          });
        }
      }
      
      return newPublisher;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create publisher';
      setError(errorMsg);
      
      // Add error notification if actions exists
      if (actions && actions.addNotification) {
        actions.addNotification({
          type: 'error',
          message: errorMsg
        });
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update publisher
  const editPublisher = async (id, publisherData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPublisher = await publisherService.update(id, publisherData);
      
      // Update global state if actions exists
      if (actions && actions.updatePublisher) {
        actions.updatePublisher(updatedPublisher);
        
        // Add success notification
        if (actions.addNotification) {
          actions.addNotification({
            type: 'success',
            message: 'Publisher updated successfully'
          });
        }
      }
      
      return updatedPublisher;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update publisher';
      setError(errorMsg);
      
      // Add error notification if actions exists
      if (actions && actions.addNotification) {
        actions.addNotification({
          type: 'error',
          message: errorMsg
        });
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete publisher
  const removePublisher = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await publisherService.delete(id);
      
      // Update global state if actions exists
      if (actions && actions.deletePublisher) {
        actions.deletePublisher(id);
        
        // Add success notification
        if (actions.addNotification) {
          actions.addNotification({
            type: 'success',
            message: 'Publisher deleted successfully'
          });
        }
      }
      
      return true;
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete publisher';
      setError(errorMsg);
      
      // Add error notification if actions exists
      if (actions && actions.addNotification) {
        actions.addNotification({
          type: 'error',
          message: errorMsg
        });
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load publishers on initial render if fetchOnMount is true
  useEffect(() => {
    if (fetchOnMount) {
      fetchPublishers(initialPage, initialLimit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnMount, initialPage, initialLimit]);

  return {
    publishers,
    currentPublisher,
    loading,
    error,
    totalPublishers,
    page,
    limit,
    fetchPublishers,
    fetchPublisherById,
    addPublisher,
    editPublisher,
    removePublisher
  };
};