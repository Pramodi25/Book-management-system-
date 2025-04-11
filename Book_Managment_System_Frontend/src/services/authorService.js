import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Adjust to your Go backend URL

// Create new author
export const createAuthor = async (authorData) => {
  try {
    const response = await axios.post(`${API_URL}/authors`, authorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create author');
  }
};

// Get all authors
export const getAuthors = async () => {
  try {
    const response = await axios.get(`${API_URL}/authors`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch authors');
  }
};