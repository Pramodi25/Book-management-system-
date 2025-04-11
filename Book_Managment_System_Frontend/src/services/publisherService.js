import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Adjust to your Go backend URL

// Create new publisher
export const createPublisher = async (publisherData) => {
  try {
    const response = await axios.post(`${API_URL}/publishers`, publisherData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create publisher');
  }
};

// Get all publishers
export const getPublishers = async () => {
  try {
    const response = await axios.get(`${API_URL}/publishers`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch publishers');
  }
};