// src/services/index.js
import bookService from './bookService';
import authorService from './authorService';
import publisherService from './publisherService';

/**
 * Export all services from a single file for convenient imports
 */
export {
  bookService,
  authorService,
  publisherService
};
