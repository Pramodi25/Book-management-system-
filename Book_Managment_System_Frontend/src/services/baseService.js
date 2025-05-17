// src/services/baseService.js
import api from '../api';

/**
 * Base service class that provides common CRUD operations
 * All specific services will extend this class
 */
export default class BaseService {
  constructor(resourceUrl) {
    this.resourceUrl = resourceUrl;
  }

  /**
   * Get all resources with pagination
   * @param {Number} page - Page number
   * @param {Number} limit - Number of items per page
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Object>} - Paginated list of resources
   */
  async getAll(page = 1, limit = 10, params = {}) {
    const response = await api.get(this.resourceUrl, {
      params: { page, limit, ...params }
    });
    return response.data;
  }

  /**
   * Get a resource by ID
   * @param {String|Number} id - Resource ID
   * @returns {Promise<Object>} - Resource object
   */
  async getById(id) {
    const response = await api.get(`${this.resourceUrl}/${id}`);
    return response.data;
  }

  /**
   * Create a new resource
   * @param {Object} data - Resource data
   * @returns {Promise<Object>} - Created resource
   */
  async create(data) {
    const response = await api.post(this.resourceUrl, data);
    return response.data;
  }

  /**
   * Update an existing resource
   * @param {String|Number} id - Resource ID
   * @param {Object} data - Updated resource data
   * @returns {Promise<Object>} - Updated resource
   */
  async update(id, data) {
    const response = await api.put(`${this.resourceUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a resource
   * @param {String|Number} id - Resource ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(id) {
    await api.delete(`${this.resourceUrl}/${id}`);
    return true;
  }

  /**
   * Search resources
   * @param {String} query - Search query
   * @param {Number} page - Page number
   * @param {Number} limit - Number of items per page
   * @returns {Promise<Object>} - Search results
   */  async search(query, page = 1, limit = 10) {
    const response = await api.get(`${this.resourceUrl}/search`, {
      params: { q: query, page, limit }
    });
    return response.data;
  }
}
