import api from './index';

export const getAllPublishers = async (page = 1, limit = 10) => {
  const response = await api.get('/publishers', {
    params: { page, limit }
  });
  return response.data;
};

export const getPublisherById = async (id) => {
  const response = await api.get(`/publishers/${id}`);
  return response.data;
};

export const createPublisher = async (publisherData) => {
  const response = await api.post('/publishers', publisherData);
  return response.data;
};

export const updatePublisher = async (id, publisherData) => {
  const response = await api.put(`/publishers/${id}`, publisherData);
  return response.data;
};

export const deletePublisher = async (id) => {
  await api.delete(`/publishers/${id}`);
  return true;
};

export const searchPublishers = async (query, page = 1, limit = 10) => {
  const response = await api.get('/publishers/search', {
    params: { q: query, page, limit }
  });
  return response.data;
};