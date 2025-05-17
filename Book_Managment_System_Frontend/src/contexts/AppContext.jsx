import React, { createContext, useContext, useReducer } from 'react';

// Initial state for the application
const initialState = {
  // Books state
  books: {
    data: [],
    totalBooks: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
    cache: {
      timestamp: null,
      data: null,
      expiresIn: 5 * 60 * 1000 // 5 minutes in milliseconds
    }
  },
  // Authors state
  authors: {
    data: [],
    totalAuthors: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
    cache: {
      timestamp: null,
      data: null,
      expiresIn: 5 * 60 * 1000 // 5 minutes in milliseconds
    }
  },
  // Publishers state
  publishers: {
    data: [],
    totalPublishers: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
    cache: {
      timestamp: null,
      data: null,
      expiresIn: 5 * 60 * 1000 // 5 minutes in milliseconds
    }
  },
  // Notifications
  notifications: []
};

// Action types
const actionTypes = {
  // Book actions
  FETCH_BOOKS_REQUEST: 'FETCH_BOOKS_REQUEST',
  FETCH_BOOKS_SUCCESS: 'FETCH_BOOKS_SUCCESS',
  FETCH_BOOKS_FAILURE: 'FETCH_BOOKS_FAILURE',
  ADD_BOOK: 'ADD_BOOK',
  UPDATE_BOOK: 'UPDATE_BOOK',
  DELETE_BOOK: 'DELETE_BOOK',
  SET_BOOKS_PAGE: 'SET_BOOKS_PAGE',
  
  // Author actions
  FETCH_AUTHORS_REQUEST: 'FETCH_AUTHORS_REQUEST',
  FETCH_AUTHORS_SUCCESS: 'FETCH_AUTHORS_SUCCESS',
  FETCH_AUTHORS_FAILURE: 'FETCH_AUTHORS_FAILURE',
  ADD_AUTHOR: 'ADD_AUTHOR',
  UPDATE_AUTHOR: 'UPDATE_AUTHOR',
  DELETE_AUTHOR: 'DELETE_AUTHOR',
  SET_AUTHORS_PAGE: 'SET_AUTHORS_PAGE',
  
  // Publisher actions
  FETCH_PUBLISHERS_REQUEST: 'FETCH_PUBLISHERS_REQUEST',
  FETCH_PUBLISHERS_SUCCESS: 'FETCH_PUBLISHERS_SUCCESS',
  FETCH_PUBLISHERS_FAILURE: 'FETCH_PUBLISHERS_FAILURE',
  ADD_PUBLISHER: 'ADD_PUBLISHER',
  UPDATE_PUBLISHER: 'UPDATE_PUBLISHER',
  DELETE_PUBLISHER: 'DELETE_PUBLISHER',
  SET_PUBLISHERS_PAGE: 'SET_PUBLISHERS_PAGE',
  
  // Notification actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION'
};

// Reducer function to handle state updates
const reducer = (state, action) => {
  switch (action.type) {
    // Book reducers
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
            ...state.books.cache,
            timestamp: Date.now(),
            data: {
              page: action.payload.page,
              limit: action.payload.limit
            }
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
          data: [action.payload, ...state.books.data],
          totalBooks: state.books.totalBooks + 1
        }
      };
    case actionTypes.UPDATE_BOOK:
      return {
        ...state,
        books: {
          ...state.books,
          data: state.books.data.map(book => 
            book.bookId === action.payload.bookId ? action.payload : book
          )
        }
      };
    case actionTypes.DELETE_BOOK:
      return {
        ...state,
        books: {
          ...state.books,
          data: state.books.data.filter(book => book.bookId !== action.payload),
          totalBooks: state.books.totalBooks - 1
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
      
    // Author reducers
    case actionTypes.FETCH_AUTHORS_REQUEST:
      return {
        ...state,
        authors: {
          ...state.authors,
          loading: true,
          error: null
        }
      };
    case actionTypes.FETCH_AUTHORS_SUCCESS:
      return {
        ...state,
        authors: {
          ...state.authors,
          data: action.payload.authors,
          totalAuthors: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          loading: false,
          error: null,
          cache: {
            ...state.authors.cache,
            timestamp: Date.now(),
            data: {
              page: action.payload.page,
              limit: action.payload.limit
            }
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
          data: [action.payload, ...state.authors.data],
          totalAuthors: state.authors.totalAuthors + 1
        }
      };
    case actionTypes.UPDATE_AUTHOR:
      return {
        ...state,
        authors: {
          ...state.authors,
          data: state.authors.data.map(author => 
            author.authorId === action.payload.authorId ? action.payload : author
          )
        }
      };
    case actionTypes.DELETE_AUTHOR:
      return {
        ...state,
        authors: {
          ...state.authors,
          data: state.authors.data.filter(author => author.authorId !== action.payload),
          totalAuthors: state.authors.totalAuthors - 1
        }
      };
    case actionTypes.SET_AUTHORS_PAGE:
      return {
        ...state,
        authors: {
          ...state.authors,
          page: action.payload.page,
          limit: action.payload.limit || state.authors.limit
        }
      };
      
    // Publisher reducers
    case actionTypes.FETCH_PUBLISHERS_REQUEST:
      return {
        ...state,
        publishers: {
          ...state.publishers,
          loading: true,
          error: null
        }
      };
    case actionTypes.FETCH_PUBLISHERS_SUCCESS:
      return {
        ...state,
        publishers: {
          ...state.publishers,
          data: action.payload.publishers,
          totalPublishers: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          loading: false,
          error: null,
          cache: {
            ...state.publishers.cache,
            timestamp: Date.now(),
            data: {
              page: action.payload.page,
              limit: action.payload.limit
            }
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
          data: [action.payload, ...state.publishers.data],
          totalPublishers: state.publishers.totalPublishers + 1
        }
      };
    case actionTypes.UPDATE_PUBLISHER:
      return {
        ...state,
        publishers: {
          ...state.publishers,
          data: state.publishers.data.map(publisher => 
            publisher.publisherId === action.payload.publisherId ? action.payload : publisher
          )
        }
      };
    case actionTypes.DELETE_PUBLISHER:
      return {
        ...state,
        publishers: {
          ...state.publishers,
          data: state.publishers.data.filter(publisher => publisher.publisherId !== action.payload),
          totalPublishers: state.publishers.totalPublishers - 1
        }
      };
    case actionTypes.SET_PUBLISHERS_PAGE:
      return {
        ...state,
        publishers: {
          ...state.publishers,
          page: action.payload.page,
          limit: action.payload.limit || state.publishers.limit
        }
      };
      
    // Notification reducers
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: Date.now() }]
      };
    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Define actions
  const actions = {
    // Books actions
    fetchBooksRequest: () => dispatch({ type: actionTypes.FETCH_BOOKS_REQUEST }),
    fetchBooksSuccess: (data) => dispatch({ type: actionTypes.FETCH_BOOKS_SUCCESS, payload: data }),
    fetchBooksFailure: (error) => dispatch({ type: actionTypes.FETCH_BOOKS_FAILURE, payload: error }),
    addBook: (book) => dispatch({ type: actionTypes.ADD_BOOK, payload: book }),
    updateBook: (book) => dispatch({ type: actionTypes.UPDATE_BOOK, payload: book }),
    deleteBook: (id) => dispatch({ type: actionTypes.DELETE_BOOK, payload: id }),
    setBooksPage: (page, limit) => dispatch({ 
      type: actionTypes.SET_BOOKS_PAGE, 
      payload: { page, limit } 
    }),
    
    // Authors actions
    fetchAuthorsRequest: () => dispatch({ type: actionTypes.FETCH_AUTHORS_REQUEST }),
    fetchAuthorsSuccess: (data) => dispatch({ type: actionTypes.FETCH_AUTHORS_SUCCESS, payload: data }),
    fetchAuthorsFailure: (error) => dispatch({ type: actionTypes.FETCH_AUTHORS_FAILURE, payload: error }),
    addAuthor: (author) => dispatch({ type: actionTypes.ADD_AUTHOR, payload: author }),
    updateAuthor: (author) => dispatch({ type: actionTypes.UPDATE_AUTHOR, payload: author }),
    deleteAuthor: (id) => dispatch({ type: actionTypes.DELETE_AUTHOR, payload: id }),
    setAuthorsPage: (page, limit) => dispatch({ 
      type: actionTypes.SET_AUTHORS_PAGE, 
      payload: { page, limit } 
    }),
    
    // Publishers actions
    fetchPublishersRequest: () => dispatch({ type: actionTypes.FETCH_PUBLISHERS_REQUEST }),
    fetchPublishersSuccess: (data) => dispatch({ type: actionTypes.FETCH_PUBLISHERS_SUCCESS, payload: data }),
    fetchPublishersFailure: (error) => dispatch({ type: actionTypes.FETCH_PUBLISHERS_FAILURE, payload: error }),
    addPublisher: (publisher) => dispatch({ type: actionTypes.ADD_PUBLISHER, payload: publisher }),
    updatePublisher: (publisher) => dispatch({ type: actionTypes.UPDATE_PUBLISHER, payload: publisher }),
    deletePublisher: (id) => dispatch({ type: actionTypes.DELETE_PUBLISHER, payload: id }),
    setPublishersPage: (page, limit) => dispatch({ 
      type: actionTypes.SET_PUBLISHERS_PAGE, 
      payload: { page, limit } 
    }),
    
    // Notification actions
    addNotification: (notification) => {
      const id = dispatch({ 
        type: actionTypes.ADD_NOTIFICATION, 
        payload: notification 
      });
      
      // Auto-remove notifications after 5 seconds
      setTimeout(() => {
        dispatch({ 
          type: actionTypes.REMOVE_NOTIFICATION, 
          payload: id 
        });
      }, 5000);
    },
    removeNotification: (id) => dispatch({ 
      type: actionTypes.REMOVE_NOTIFICATION, 
      payload: id 
    })
  };
  
  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export default AppContext;