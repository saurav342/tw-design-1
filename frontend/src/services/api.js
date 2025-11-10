const trimTrailingSlash = (value) => (value.endsWith('/') ? value.slice(0, -1) : value);
const DEFAULT_API_BASE = 'https://backend.launchandlift.com/api';
const LOCAL_API_BASE = 'http://localhost:3000/api';
const isLocalHostname = (hostname = '') =>
  ['localhost', '127.0.0.1', '::1'].includes(hostname.replace(/^\[|\]$/g, ''));

const resolveApiBaseUrl = () => {
  const explicit = import.meta.env.VITE_API_URL;
  const hasWindow = typeof window !== 'undefined';

  if (explicit) {
    const normalized = trimTrailingSlash(explicit);

    if (hasWindow && window.location.protocol === 'https:' && normalized.startsWith('http://')) {
      console.warn(
        '[LaunchAndLift] Detected insecure API base on HTTPS page. Falling back to default backend. ' +
          'Set up a reverse proxy or provide an HTTPS API URL to avoid mixed-content blocks.',
      );
      return DEFAULT_API_BASE;
    }

    return normalized;
  }

  if (hasWindow) {
    const { origin, hostname } = window.location;

    if (isLocalHostname(hostname)) {
      return `${origin}/api`;
    }
  }

  if (import.meta.env.DEV) {
    return LOCAL_API_BASE;
  }

  return DEFAULT_API_BASE;
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
    const error = new Error(message || 'Request failed');
    // Attach full payload for error handling
    if (typeof payload === 'object' && payload !== null) {
      error.data = payload;
    }
    throw error;
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
  sendVerificationEmail: (payload) => apiClient.post('/auth/send-verification-email', payload),
  verifyEmail: (payload) => apiClient.post('/auth/verify-email', payload),
  checkEmailVerification: (email, role) => apiClient.get(`/auth/check-email-verification?email=${encodeURIComponent(email)}&role=${role}`),
  resetPassword: (payload) => apiClient.post('/auth/reset-password', payload),
  fetchProfile: (token) => apiClient.get('/auth/profile', token),
};

export const adminAuthApi = {
  login: (credentials) => apiClient.post('/admin/auth/login', credentials),
  signup: (payload) => apiClient.post('/admin/auth/signup', payload),
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

export const adminApi = {
  getUsers: (token) => apiClient.get('/admin/users', token),
  updateUser: (userId, data, token) => apiClient.patch(`/admin/users/${userId}`, data, token),
  deleteUser: (userId, token) => apiClient.delete(`/admin/users/${userId}`, token),
  getMetrics: (token) => apiClient.get('/admin/metrics', token),
  getAnalytics: (token) => apiClient.get('/admin/analytics', token),
  getActivityLog: (token, limit) => apiClient.get(`/admin/activity-log${limit ? `?limit=${limit}` : ''}`, token),
  getDashboardSummary: (token) => apiClient.get('/admin/dashboard-summary', token),
  getFounders: (token) => apiClient.get('/admin/founders', token),
  getInvestors: (token) => apiClient.get('/admin/investors', token),
};

export const uploadApi = {
  uploadPitchDeck: async (file) => {
    const formData = new FormData();
    formData.append('pitchDeck', file);

    const response = await fetch(`${API_BASE_URL}/upload/pitch-deck`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload file');
    }

    return response.json();
  },
};

export const paymentApi = {
  getPaymentAmount: (email) => apiClient.get(`/payment/amount?email=${encodeURIComponent(email)}`),
  getCouponSettings: () => apiClient.get('/payment/coupon-settings'),
  createOrder: (data) => apiClient.post('/payment/create-order', data),
  verifyPayment: (data) => apiClient.post('/payment/verify', data),
  getPaymentStatus: (orderId) => apiClient.get(`/payment/status/${orderId}`),
  validateCoupon: (data) => apiClient.post('/payment/validate-coupon', data),
};

export const paymentAdminApi = {
  getPaymentConfigs: (token) => apiClient.get('/admin/payment/payment-configs', token),
  createOrUpdatePaymentConfig: (data, token) => apiClient.post('/admin/payment/payment-configs', data, token),
  deletePaymentConfig: (email, token) => apiClient.delete(`/admin/payment/payment-configs/${encodeURIComponent(email)}`, token),
  getCoupons: (token) => apiClient.get('/admin/payment/coupons', token),
  createCoupon: (data, token) => apiClient.post('/admin/payment/coupons', data, token),
  updateCoupon: (code, data, token) => apiClient.patch(`/admin/payment/coupons/${code}`, data, token),
  deleteCoupon: (code, token) => apiClient.delete(`/admin/payment/coupons/${code}`, token),
  getCouponSettings: (token) => apiClient.get('/admin/payment/coupon-settings', token),
  updateCouponSettings: (data, token) => apiClient.patch('/admin/payment/coupon-settings', data, token),
};
