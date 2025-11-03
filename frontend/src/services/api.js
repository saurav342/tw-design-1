const trimTrailingSlash = (value) => (value.endsWith('/') ? value.slice(0, -1) : value);

const resolveApiBaseUrl = () => {
  const explicit = import.meta.env.VITE_API_URL;
  const hasWindow = typeof window !== 'undefined';

  if (explicit) {
    const normalized = trimTrailingSlash(explicit);

    if (hasWindow && window.location.protocol === 'https:' && normalized.startsWith('http://')) {
      console.warn(
        '[LaunchAndLift] Detected insecure API base on HTTPS page. Falling back to same-origin /api. ' +
          'Set up a reverse proxy or provide an HTTPS API URL to avoid mixed-content blocks.',
      );
      return `${window.location.origin}/api`;
    }

    return normalized;
  }

  if (hasWindow) {
    return `${window.location.origin}/api`;
  }

  return 'http://localhost:5000/api';
};

const API_BASE_URL = resolveApiBaseUrl();

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
  sendOtp: (payload) => apiClient.post('/auth/send-otp', payload),
  verifyOtp: (payload) => apiClient.post('/auth/verify-otp', payload),
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

export const intakeApi = {
  submitFounder: (data) => apiClient.post('/intakes/founders', data),
  listFounders: (token) => apiClient.get('/intakes/founders', token),
};

export const founderExtrasApi = {
  listAll: (token) => apiClient.get('/founder-extras', token),
  getByFounder: (founderId, token) => apiClient.get(`/founder-extras/${founderId}`, token),
  saveMarketplace: (founderId, data, token) =>
    apiClient.put(`/founder-extras/${founderId}/marketplace`, data, token),
  saveSuccessFee: (founderId, data, token) =>
    apiClient.put(`/founder-extras/${founderId}/success-fee`, data, token),
  createServiceRequest: (founderId, data, token) =>
    apiClient.post(`/founder-extras/${founderId}/service-requests`, data, token),
};
