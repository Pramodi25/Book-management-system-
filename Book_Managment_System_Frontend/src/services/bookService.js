import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Adjust to your Go backend URL

// Get all books or search books
export const getBooks = async (searchTerm = '') => {
  try {
    const endpoint = searchTerm 
      ? `${API_URL}/books/search?q=${encodeURIComponent(searchTerm)}` 
      : `${API_URL}/books`;
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch books');
  }
};

// Get book by ID
export const getBookById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/books/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch book');
  }
};

// Create new book
export const createBook = async (bookData) => {
  try {
    const response = await axios.post(`${API_URL}/books`, bookData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create book');
  }
};

// Update book
export const updateBook = async (id, bookData) => {
  try {
    const response = await axios.put(`${API_URL}/books/${id}`, bookData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update book');
  }
};

// Delete book
export const deleteBook = async (id) => {
  try {
    await axios.delete(`${API_URL}/books/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete book');
  }
};