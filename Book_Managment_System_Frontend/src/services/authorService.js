// src/services/authorService.js
import BaseService from './baseService';

/**
 * Author service for handling all author-related API requests
 */
class AuthorService extends BaseService {
  constructor() {
    super('/authors');
  }

  /**
   * Search authors by name, etc.
   * @param {String} query - Search query
   * @param {Number} page - Page number
   * @param {Number} limit - Number of items per page
   * @returns {Promise<Object>} - Search results with pagination
   */
  async searchAuthors(query, page = 1, limit = 10) {
    const response = await this.search(query, page, limit);
    return response;
  }

  /**
   * Get author with their books
   * @param {String|Number} authorId - Author ID
   * @returns {Promise<Object>} - Author with books
   */
  async getAuthorWithBooks(authorId) {
    const response = await this.getById(authorId);
    return response;
  }
}

// Export a singleton instance
export default new AuthorService();
