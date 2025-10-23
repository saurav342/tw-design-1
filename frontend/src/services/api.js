const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const buildHeaders = (token, extraHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const payload = contentType && contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.message;
    throw new Error(message || 'Request failed');
  }

  return payload;
};

export const apiClient = {
  get: async (path, token) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: buildHeaders(token),
    });

    return handleResponse(response);
  },
  post: async (path, data, token) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },
  put: async (path, data, token) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: buildHeaders(token),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },
  patch: async (path, data, token) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: buildHeaders(token),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },
  delete: async (path, token) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: buildHeaders(token),
    });

    return handleResponse(response);
  },
};

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  signup: (payload) => apiClient.post('/auth/signup', payload),
  resetPassword: (payload) => apiClient.post('/auth/reset-password', payload),
  fetchProfile: (token) => apiClient.get('/auth/profile', token),
};

export const contentApi = {
  stats: (token) => apiClient.get('/content/stats', token),
  updateStats: (data, token) => apiClient.put('/content/stats', data, token),
  testimonials: () => apiClient.get('/content/testimonials'),
  upsertTestimonial: (data, token) => apiClient.post('/content/testimonials', data, token),
  deleteTestimonial: (id, token) => apiClient.delete(`/content/testimonials/${id}`, token),
  faqs: (audience) => apiClient.get(`/content/faqs${audience ? `?audience=${audience}` : ''}`),
  upsertFaq: (data, token) => apiClient.post('/content/faqs', data, token),
  deleteFaq: (id, token) => apiClient.delete(`/content/faqs/${id}`, token),
  team: () => apiClient.get('/content/team'),
  news: () => apiClient.get('/content/news'),
  portfolio: () => apiClient.get('/portfolio'),
  upsertPortfolio: (data, token) => apiClient.post('/portfolio', data, token),
  deletePortfolio: (id, token) => apiClient.delete(`/portfolio/${id}`, token),
};
