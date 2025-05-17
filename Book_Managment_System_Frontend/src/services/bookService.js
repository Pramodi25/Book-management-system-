// src/services/bookService.js
import BaseService from './baseService';

/**
 * Book service for handling all book-related API requests
 */
class BookService extends BaseService {
  constructor() {
    super('/books');
  }

  /**
   * Search books by title, author, genre, etc.
   * @param {String} query - Search query
   * @param {Number} page - Page number
   * @param {Number} limit - Number of items per page
   * @returns {Promise<Object>} - Search results with pagination
   */
  async searchBooks(query, page = 1, limit = 10) {
    const response = await this.search(query, page, limit);
    return response;
  }

  /**
   * Get books by author ID
   * @param {String|Number} authorId - Author ID
   * @param {Number} page - Page number
   * @param {Number} limit - Number of items per page
   * @returns {Promise<Object>} - Books by the specified author
   */
  async getBooksByAuthor(authorId, page = 1, limit = 10) {
    const response = await this.getAll(page, limit, { authorId });
    return response;
  }

  /**
   * Get books by publisher ID
   * @param {String|Number} publisherId - Publisher ID
   * @param {Number} page - Page number
   * @param {Number} limit - Number of items per page
   * @returns {Promise<Object>} - Books by the specified publisher
   */
  async getBooksByPublisher(publisherId, page = 1, limit = 10) {
    const response = await this.getAll(page, limit, { publisherId });
    return response;
  }

  /**
   * Get books by genre
   * @param {String} genre - Genre name
   * @param {Number} page - Page number
   * @param {Number} limit - Number of items per page
   * @returns {Promise<Object>} - Books in the specified genre
   */
  async getBooksByGenre(genre, page = 1, limit = 10) {
    const response = await this.getAll(page, limit, { genre });
    return response;
  }
}

// Export a singleton instance
export default new BookService();
