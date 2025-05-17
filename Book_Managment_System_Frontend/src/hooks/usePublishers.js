import { useState, useEffect } from 'react';
import { getAllPublishers, getPublisherById, createPublisher, updatePublisher, deletePublisher } from '../api/publishersApi';
import { useAppContext } from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';

export const usePublishers = (fetchOnMount = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [publishers, setPublishers] = useState([]);
  const [currentPublisher, setCurrentPublisher] = useState(null);
  const { state, dispatch, actions } = useAppContext();

  // Define cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Fetch all publishers
  const fetchPublishers = async () => {
    setLoading(true);
    setError(null);

    // Check if we have valid cached data
    const now = Date.now();
    const cache = state.publishers?.cache;
    
    if (
      cache?.timestamp && 
      cache?.data && 
      (now - cache.timestamp < CACHE_DURATION)
    ) {
      // Use cached data
      setPublishers(cache.data);
      dispatch({ 
        type: 'FETCH_PUBLISHERS_SUCCESS', 
        payload: cache.data 
      });
      setLoading(false);
      return cache.data;
    }
    
    try {
      const data = await getAllPublishers();
      setPublishers(data);
      dispatch({ 
        type: 'FETCH_PUBLISHERS_SUCCESS', 
        payload: data
      });
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch publishers';
      setError(errorMsg);
      dispatch({ 
        type: 'FETCH_PUBLISHERS_FAILURE', 
        payload: errorMsg 
      });
      throw err;
    } finally {
      setLoading(false);
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
      const publisher = await getPublisherById(id);
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
      // Add UUID if not provided
      if (!publisherData.publisherId) {
        publisherData.publisherId = uuidv4();
      }
      const newPublisher = await createPublisher(publisherData);
      
      // Update local state and global state
      setPublishers(prev => [...prev, newPublisher]);
      dispatch({ type: 'ADD_PUBLISHER', payload: newPublisher });
      
      // Add success notification
      actions.addNotification({
        type: 'success',
        message: 'Publisher created successfully'
      });
      
      return newPublisher;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create publisher';
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

  // Update publisher
  const editPublisher = async (id, publisherData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPublisher = await updatePublisher(id, publisherData);
      
      // Update local state
      setPublishers(prev => prev.map(publisher => 
        publisher.publisherId === id ? updatedPublisher : publisher
      ));
      
      // Update global state (we'll add this action to the reducer)
      dispatch({ type: 'UPDATE_PUBLISHER', payload: updatedPublisher });
      
      return updatedPublisher;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update publisher';
      setError(errorMsg);
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
      await deletePublisher(id);
      
      // Update local state
      setPublishers(prev => prev.filter(publisher => publisher.publisherId !== id));
      
      // Update global state (we'll add this action to the reducer)
      dispatch({ type: 'DELETE_PUBLISHER', payload: id });
      
      return true;
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete publisher';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load publishers on initial render if fetchOnMount is true
  useEffect(() => {
    if (fetchOnMount) {
      fetchPublishers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnMount]);

  return {
    publishers,
    currentPublisher,
    loading,
    error,
    fetchPublishers,
    fetchPublisherById,
    addPublisher,
    editPublisher,
    removePublisher
  };
};