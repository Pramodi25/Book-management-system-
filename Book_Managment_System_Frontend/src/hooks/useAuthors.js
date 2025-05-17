import { useState, useEffect } from 'react';
import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } from '../api/authorsApi';
import { useAppContext } from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';

export const useAuthors = (fetchOnMount = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const { state, dispatch, actions } = useAppContext();

  // Define cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Fetch all authors
  const fetchAuthors = async () => {
    setLoading(true);
    setError(null);

    // Check if we have valid cached data
    const now = Date.now();
    const cache = state.authors?.cache;
    
    if (
      cache?.timestamp && 
      cache?.data && 
      (now - cache.timestamp < CACHE_DURATION)
    ) {
      // Use cached data
      setAuthors(cache.data);
      dispatch({ 
        type: 'FETCH_AUTHORS_SUCCESS', 
        payload: cache.data 
      });
      setLoading(false);
      return cache.data;
    }
    
    try {
      const data = await getAllAuthors();
      setAuthors(data);
      dispatch({ 
        type: 'FETCH_AUTHORS_SUCCESS', 
        payload: data
      });
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch authors';
      setError(errorMsg);
      dispatch({ 
        type: 'FETCH_AUTHORS_FAILURE', 
        payload: errorMsg 
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch author by ID
  const fetchAuthorById = async (id) => {
    setLoading(true);
    setError(null);
    
    // First check if we have the author in our current state
    const cachedAuthor = authors.find(author => author.authorId === id);
    if (cachedAuthor) {
      setCurrentAuthor(cachedAuthor);
      setLoading(false);
      return cachedAuthor;
    }
    
    try {
      const author = await getAuthorById(id);
      setCurrentAuthor(author);
      return author;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch author';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
      
      // Update local state and global state
      setAuthors(prev => [...prev, newAuthor]);
      dispatch({ type: 'ADD_AUTHOR', payload: newAuthor });
      
      // Add success notification
      actions.addNotification({
        type: 'success',
        message: 'Author created successfully'
      });
      
      return newAuthor;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create author';
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

  // Update author
  const editAuthor = async (id, authorData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAuthor = await updateAuthor(id, authorData);
      
      // Update local state
      setAuthors(prev => prev.map(author => 
        author.authorId === id ? updatedAuthor : author
      ));
      
      // Update global state (we'll add this action to the reducer)
      dispatch({ type: 'UPDATE_AUTHOR', payload: updatedAuthor });
      
      return updatedAuthor;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update author';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete author
  const removeAuthor = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAuthor(id);
      
      // Update local state
      setAuthors(prev => prev.filter(author => author.authorId !== id));
      
      // Update global state (we'll add this action to the reducer)
      dispatch({ type: 'DELETE_AUTHOR', payload: id });
      
      return true;
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete author';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };
  // Load authors on initial render if fetchOnMount is true
  useEffect(() => {
    if (fetchOnMount) {
      fetchAuthors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnMount]);

  return {
    authors,
    currentAuthor,
    loading,
    error,
    fetchAuthors,
    fetchAuthorById,
    addAuthor,
    editAuthor,
    removeAuthor
  };
};