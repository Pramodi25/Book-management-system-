// src/api/booksApi.js
import api from './index';

export const getAllBooks = async (page = 1, limit = 10) => {
  const response = await api.get('/books', {
    params: { page, limit }
  });
  return response.data;
};

export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (bookData) => {
  const response = await api.post('/books', bookData);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  await api.delete(`/books/${id}`);
  return true;
};

export const searchBooks = async (query, page = 1, limit = 10) => {
  const response = await api.get('/books/search', {
    params: { q: query, page, limit }
  });
  return response.data;
};