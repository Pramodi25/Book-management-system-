import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getAllBooks } from '../api/booksApi';
import { getAllAuthors } from '../api/authorsApi';
import { getAllPublishers } from '../api/publishersApi';

// Create context
const AppContext = createContext();

// Initial state
const initialState = {
  books: {
    data: [],
    loading: false,
    error: null,
    totalBooks: 0,
    page: 1,
    limit: 10,
    cache: {
      timestamp: null,
      data: null,
      expiresIn: 5 * 60 * 1000 // 5 minutes in milliseconds
    }
  },  authors: {
    data: [],
    loading: false,
    error: null,
    cache: {
      timestamp: null,
      data: null,
      expiresIn: 5 * 60 * 1000 // 5 minutes in milliseconds
    }
  },
  publishers: {
    data: [],
    loading: false,
    error: null,
    cache: {
      timestamp: null,
      data: null,
      expiresIn: 5 * 60 * 1000 // 5 minutes in milliseconds
    }
  },
  ui: {
    theme: 'light',
    sidebarOpen: true,
    notifications: []
  }
};

// Action types
const actionTypes = {
  // Books
  FETCH_BOOKS_REQUEST: 'FETCH_BOOKS_REQUEST',
  FETCH_BOOKS_SUCCESS: 'FETCH_BOOKS_SUCCESS',
  FETCH_BOOKS_FAILURE: 'FETCH_BOOKS_FAILURE',
  ADD_BOOK: 'ADD_BOOK',
  UPDATE_BOOK: 'UPDATE_BOOK',
  DELETE_BOOK: 'DELETE_BOOK',
  SET_BOOKS_PAGE: 'SET_BOOKS_PAGE',
    // Authors
  FETCH_AUTHORS_REQUEST: 'FETCH_AUTHORS_REQUEST',
  FETCH_AUTHORS_SUCCESS: 'FETCH_AUTHORS_SUCCESS',
  FETCH_AUTHORS_FAILURE: 'FETCH_AUTHORS_FAILURE',
  ADD_AUTHOR: 'ADD_AUTHOR',
  UPDATE_AUTHOR: 'UPDATE_AUTHOR',
  DELETE_AUTHOR: 'DELETE_AUTHOR',
  
  // Publishers
  FETCH_PUBLISHERS_REQUEST: 'FETCH_PUBLISHERS_REQUEST',
  FETCH_PUBLISHERS_SUCCESS: 'FETCH_PUBLISHERS_SUCCESS',
  FETCH_PUBLISHERS_FAILURE: 'FETCH_PUBLISHERS_FAILURE',
  ADD_PUBLISHER: 'ADD_PUBLISHER',
  UPDATE_PUBLISHER: 'UPDATE_PUBLISHER',
  DELETE_PUBLISHER: 'DELETE_PUBLISHER',
  
  // UI
  TOGGLE_THEME: 'TOGGLE_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    // Books
    case actionTypes.FETCH_BOOKS_REQUEST:
      return {
        ...state,
        books: {
          ...state.books,
          loading: true,
          error: null
        }
      };
    case actionTypes.FETCH_BOOKS_SUCCESS:
      return {
        ...state,
        books: {
          ...state.books,
          data: action.payload.books,
          totalBooks: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          loading: false,
          error: null,
          cache: {
            timestamp: Date.now(),
            data: action.payload,
            expiresIn: state.books.cache.expiresIn
          }
        }
      };
    case actionTypes.FETCH_BOOKS_FAILURE:
      return {
        ...state,
        books: {
          ...state.books,
          loading: false,
          error: action.payload
        }
      };
    case actionTypes.ADD_BOOK:
      return {
        ...state,
        books: {
          ...state.books,
          data: [...state.books.data, action.payload],
          totalBooks: state.books.totalBooks + 1,
          cache: {
            ...state.books.cache,
            timestamp: null // Invalidate cache
          }
        }
      };
    case actionTypes.UPDATE_BOOK:
      return {
        ...state,
        books: {
          ...state.books,
          data: state.books.data.map(book => 
            book.bookId === action.payload.bookId ? action.payload : book
          ),
          cache: {
            ...state.books.cache,
            timestamp: null // Invalidate cache
          }
        }
      };
    case actionTypes.DELETE_BOOK:
      return {
        ...state,
        books: {
          ...state.books,
          data: state.books.data.filter(book => book.bookId !== action.payload),
          totalBooks: state.books.totalBooks - 1,
          cache: {
            ...state.books.cache,
            timestamp: null // Invalidate cache
          }
        }
      };
    case actionTypes.SET_BOOKS_PAGE:
      return {
        ...state,
        books: {
          ...state.books,
          page: action.payload.page,
          limit: action.payload.limit || state.books.limit
        }
      };
      
    // Authors
    case actionTypes.FETCH_AUTHORS_REQUEST:
      return {
        ...state,
        authors: {
          ...state.authors,
          loading: true,
          error: null
        }
      };    case actionTypes.FETCH_AUTHORS_SUCCESS:
      return {
        ...state,
        authors: {
          ...state.authors,
          data: action.payload,
          loading: false,
          error: null,
          cache: {
            timestamp: Date.now(),
            data: action.payload,
            expiresIn: state.authors.cache.expiresIn
          }
        }
      };
    case actionTypes.FETCH_AUTHORS_FAILURE:
      return {
        ...state,
        authors: {
          ...state.authors,
          loading: false,
          error: action.payload
        }
      };
    case actionTypes.ADD_AUTHOR:
      return {
        ...state,
        authors: {
          ...state.authors,
          data: [...state.authors.data, action.payload],
          cache: {
            ...state.authors.cache,
            timestamp: null // Invalidate cache
          }
        }
      };
    case actionTypes.UPDATE_AUTHOR:
      return {
        ...state,
        authors: {
          ...state.authors,
          data: state.authors.data.map(author => 
            author.authorId === action.payload.authorId ? action.payload : author
          ),
          cache: {
            ...state.authors.cache,
            timestamp: null // Invalidate cache
          }
        }
      };
    case actionTypes.DELETE_AUTHOR:
      return {
        ...state,
        authors: {
          ...state.authors,
          data: state.authors.data.filter(author => author.authorId !== action.payload),
          cache: {
            ...state.authors.cache,
            timestamp: null // Invalidate cache
          }
        }
      };
      
    // Publishers
    case actionTypes.FETCH_PUBLISHERS_REQUEST:
      return {
        ...state,
        publishers: {
          ...state.publishers,
          loading: true,
          error: null
        }
      };    case actionTypes.FETCH_PUBLISHERS_SUCCESS:
      return {
        ...state,
        publishers: {
          ...state.publishers,
          data: action.payload,
          loading: false,
          error: null,
          cache: {
            timestamp: Date.now(),
            data: action.payload,
            expiresIn: state.publishers.cache.expiresIn
          }
        }
      };
    case actionTypes.FETCH_PUBLISHERS_FAILURE:
      return {
        ...state,
        publishers: {
          ...state.publishers,
          loading: false,
          error: action.payload
        }
      };
    case actionTypes.ADD_PUBLISHER:
      return {
        ...state,
        publishers: {
          ...state.publishers,
          data: [...state.publishers.data, action.payload],
          cache: {
            ...state.publishers.cache,
            timestamp: null // Invalidate cache
          }
        }
      };
    case actionTypes.UPDATE_PUBLISHER:
      return {
        ...state,
        publishers: {
          ...state.publishers,
          data: state.publishers.data.map(publisher => 
            publisher.publisherId === action.payload.publisherId ? action.payload : publisher
          ),
          cache: {
            ...state.publishers.cache,
            timestamp: null // Invalidate cache
          }
        }
      };
    case actionTypes.DELETE_PUBLISHER:
      return {
        ...state,
        publishers: {
          ...state.publishers,
          data: state.publishers.data.filter(publisher => publisher.publisherId !== action.payload),
          cache: {
            ...state.publishers.cache,
            timestamp: null // Invalidate cache
          }
        }
      };
      
    // UI
    case actionTypes.TOGGLE_THEME:
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: state.ui.theme === 'light' ? 'dark' : 'light'
        }
      };
    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen
        }
      };
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, {
            id: Date.now(),
            ...action.payload
          }]
        }
      };
    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(
            notification => notification.id !== action.payload
          )
        }
      };
      
    default:
      return state;
  }
}

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Create convenience action dispatchers
  const actions = {
    // Books
    fetchBooks: async (page = 1, limit = 10) => {
      dispatch({ type: actionTypes.FETCH_BOOKS_REQUEST });
      
      // Check if we have valid cached data
      const now = Date.now();
      const cache = state.books.cache;
      
      if (
        cache.timestamp && 
        cache.data && 
        (now - cache.timestamp < cache.expiresIn) &&
        cache.data.page === page &&
        cache.data.limit === limit
      ) {
        // Use cached data
        dispatch({ 
          type: actionTypes.FETCH_BOOKS_SUCCESS, 
          payload: cache.data 
        });
        return cache.data;
      }
      
      try {
        const data = await getAllBooks(page, limit);
        dispatch({ 
          type: actionTypes.FETCH_BOOKS_SUCCESS, 
          payload: { ...data, page, limit } 
        });
        return data;
      } catch (error) {
        dispatch({ 
          type: actionTypes.FETCH_BOOKS_FAILURE, 
          payload: error.message 
        });
        throw error;
      }
    },
    
    addBook: (book) => {
      dispatch({ type: actionTypes.ADD_BOOK, payload: book });
    },
    
    updateBook: (book) => {
      dispatch({ type: actionTypes.UPDATE_BOOK, payload: book });
    },
    
    deleteBook: (bookId) => {
      dispatch({ type: actionTypes.DELETE_BOOK, payload: bookId });
    },
    
    setBooksPage: (page, limit) => {
      dispatch({ 
        type: actionTypes.SET_BOOKS_PAGE, 
        payload: { page, limit } 
      });
    },
      // UI actions
    toggleTheme: () => {
      dispatch({ type: actionTypes.TOGGLE_THEME });
    },
    
    toggleSidebar: () => {
      dispatch({ type: actionTypes.TOGGLE_SIDEBAR });
    },
    
    // Authors actions
    fetchAuthors: async () => {
      dispatch({ type: actionTypes.FETCH_AUTHORS_REQUEST });
      
      // Check if we have valid cached data
      const now = Date.now();
      const cache = state.authors.cache;
      
      if (
        cache.timestamp && 
        cache.data && 
        (now - cache.timestamp < cache.expiresIn)
      ) {
        // Use cached data
        dispatch({ 
          type: actionTypes.FETCH_AUTHORS_SUCCESS, 
          payload: cache.data 
        });
        return cache.data;
      }
      
      try {
        const data = await getAllAuthors();
        dispatch({ 
          type: actionTypes.FETCH_AUTHORS_SUCCESS, 
          payload: data 
        });
        return data;
      } catch (error) {
        dispatch({ 
          type: actionTypes.FETCH_AUTHORS_FAILURE, 
          payload: error.message 
        });
        throw error;
      }
    },
    
    addAuthor: (author) => {
      dispatch({ type: actionTypes.ADD_AUTHOR, payload: author });
    },
    
    updateAuthor: (author) => {
      dispatch({ type: actionTypes.UPDATE_AUTHOR, payload: author });
    },
    
    deleteAuthor: (authorId) => {
      dispatch({ type: actionTypes.DELETE_AUTHOR, payload: authorId });
    },
    
    // Publishers actions
    fetchPublishers: async () => {
      dispatch({ type: actionTypes.FETCH_PUBLISHERS_REQUEST });
      
      // Check if we have valid cached data
      const now = Date.now();
      const cache = state.publishers.cache;
      
      if (
        cache.timestamp && 
        cache.data && 
        (now - cache.timestamp < cache.expiresIn)
      ) {
        // Use cached data
        dispatch({ 
          type: actionTypes.FETCH_PUBLISHERS_SUCCESS, 
          payload: cache.data 
        });
        return cache.data;
      }
      
      try {
        const data = await getAllPublishers();
        dispatch({ 
          type: actionTypes.FETCH_PUBLISHERS_SUCCESS, 
          payload: data 
        });
        return data;
      } catch (error) {
        dispatch({ 
          type: actionTypes.FETCH_PUBLISHERS_FAILURE, 
          payload: error.message 
        });
        throw error;
      }
    },
    
    addPublisher: (publisher) => {
      dispatch({ type: actionTypes.ADD_PUBLISHER, payload: publisher });
    },
    
    updatePublisher: (publisher) => {
      dispatch({ type: actionTypes.UPDATE_PUBLISHER, payload: publisher });
    },
    
    deletePublisher: (publisherId) => {
      dispatch({ type: actionTypes.DELETE_PUBLISHER, payload: publisherId });
    },
    
    addNotification: (notification) => {
      dispatch({ 
        type: actionTypes.ADD_NOTIFICATION, 
        payload: notification 
      });
      
      // Auto-remove notification after timeout
      if (notification.timeout !== false) {
        setTimeout(() => {
          dispatch({
            type: actionTypes.REMOVE_NOTIFICATION,
            payload: Date.now() // This will be the ID assigned in the reducer
          });
        }, notification.timeout || 5000);
      }
    },
    
    removeNotification: (id) => {
      dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: id });
    }
  };
  
  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { actionTypes };