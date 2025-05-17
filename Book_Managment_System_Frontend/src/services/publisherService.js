// src/services/publisherService.js
import BaseService from './baseService';

/**
 * Publisher service for handling all publisher-related API requests
 */
class PublisherService extends BaseService {
  constructor() {
    super('/publishers');
  }

  /**
   * Search publishers by name, etc.
   * @param {String} query - Search query
   * @param {Number} page - Page number
   * @param {Number} limit - Number of items per page
   * @returns {Promise<Object>} - Search results with pagination
   */
  async searchPublishers(query, page = 1, limit = 10) {
    const response = await this.search(query, page, limit);
    return response;
  }

  /**
   * Get publisher with their books
   * @param {String|Number} publisherId - Publisher ID
   * @returns {Promise<Object>} - Publisher with books
   */
  async getPublisherWithBooks(publisherId) {
    const response = await this.getById(publisherId);
    return response;
  }
}

// Export a singleton instance
export default new PublisherService();
