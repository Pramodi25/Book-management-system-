import { useState, useEffect } from 'react';
import { authorService } from '../services';
import { useAppContext } from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';

export const useAuthors = (initialPage = 1, initialLimit = 10, fetchOnMount = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const { state, actions } = useAppContext();
  
  // Extract authors state from global context
  const authors = state?.authors?.data || [];
  const totalAuthors = state?.authors?.totalAuthors || 0;
  const page = state?.authors?.page || initialPage;
  const limit = state?.authors?.limit || initialLimit;

  // Fetch all authors using the global context and service layer
  const fetchAuthors = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we should use cache from global state
      const now = Date.now();
      const cache = state?.authors?.cache || {};
      
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
          authors: state.authors.data, 
          total: state.authors.totalAuthors 
        };
      }
      
      // Fetch from API using service
      const response = await authorService.getAll(page, limit);
      
      // Update global state if actions exists
      if (actions && actions.fetchAuthorsSuccess) {
        actions.fetchAuthorsSuccess({
          authors: response.authors || [],
          total: response.total || 0,
          page,
          limit
        });
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch authors';
      setError(errorMsg);
      
      // Update global state with error if actions exists
      if (actions && actions.fetchAuthorsFailure) {
        actions.fetchAuthorsFailure(errorMsg);
      }
      
      setLoading(false);
      throw err;
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
      const author = await authorService.getById(id);
      setCurrentAuthor(author);
      return author;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch author';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };  // Create new author
  const addAuthor = async (authorData) => {
    setLoading(true);
    setError(null);
    try {
      // Generate UUID if not provided
      const authorId = authorData.authorId || uuidv4();
      
      // Transform frontend author data to match backend structure
      const backendAuthorData = {
        authorId: authorId,
        name: `${authorData.firstName || ''} ${authorData.lastName || ''}`.trim() || authorData.name,
        bio: authorData.biography || authorData.bio || '',
      };
      
      console.log('Submitting author data to backend:', backendAuthorData);
      const newAuthor = await authorService.create(backendAuthorData);
      console.log('Response from backend:', newAuthor);
      
      // Update global state if actions exists
      if (actions && actions.addAuthor) {
        actions.addAuthor(newAuthor);
        
        // Add success notification
        if (actions.addNotification) {
          actions.addNotification({
            type: 'success',
            message: 'Author created successfully'
          });
        }
      }
      
      return newAuthor;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create author';
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

  // Update author
  const editAuthor = async (id, authorData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAuthor = await authorService.update(id, authorData);
      
      // Update global state if actions exists
      if (actions && actions.updateAuthor) {
        actions.updateAuthor(updatedAuthor);
        
        // Add success notification
        if (actions.addNotification) {
          actions.addNotification({
            type: 'success',
            message: 'Author updated successfully'
          });
        }
      }
      
      return updatedAuthor;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update author';
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

  // Delete author
  const removeAuthor = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await authorService.delete(id);
      
      // Update global state if actions exists
      if (actions && actions.deleteAuthor) {
        actions.deleteAuthor(id);
        
        // Add success notification
        if (actions.addNotification) {
          actions.addNotification({
            type: 'success',
            message: 'Author deleted successfully'
          });
        }
      }
      
      return true;
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete author';
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

  // Load authors on initial render if fetchOnMount is true
  useEffect(() => {
    if (fetchOnMount) {
      fetchAuthors(initialPage, initialLimit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnMount, initialPage, initialLimit]);

  return {
    authors,
    currentAuthor,
    loading,
    error,
    totalAuthors,
    page,
    limit,
    fetchAuthors,
    fetchAuthorById,
    addAuthor,
    editAuthor,
    removeAuthor
  };
};