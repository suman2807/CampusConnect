import axios from 'axios';

// Use environment variable for API base URL, fallback based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? `${window.location.origin}/api` : 'http://localhost:3001/api');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging in development
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
  
  api.interceptors.request.use((config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error('API Error:', error.response?.status, error.config.url, error.message);
      return Promise.reject(error);
    }
  );
}


// User API functions
export const userAPI = {
  createOrUpdateUser: async (userData) => {
    return api.post('/users', userData);
  },
  
  getUser: async (clerkId) => {
    return api.get(`/users/${clerkId}`);
  },
};

// Request API functions
export const requestAPI = {
  createRequest: async (userData, requestData) => {
    return api.post('/requests', { ...requestData, user: userData });
  },
  
  getAllRequests: async (type = null, limit = 50, page = 1) => {
    const params = { limit, page };
    if (type) params.type = type;
    return api.get('/requests', { params });
  },
  
  getRequest: async (id) => {
    return api.get(`/requests/${id}`);
  },
  
  joinRequest: async (userData, requestId) => {
    return api.put(`/requests/${requestId}/join`, { user: userData });
  },
  
  updateRequestStatus: async (userData, requestId, status, reason = '') => {
    return api.put(`/requests/${requestId}/status`, { 
      user: userData, 
      status, 
      reason 
    });
  },
  
  updateRequest: async (userData, requestId, updateData) => {
    return api.put(`/requests/${requestId}`, { 
      user: userData, 
      ...updateData 
    });
  },
  
  deleteRequest: async (userData, requestId, reason = '') => {
    return api.delete(`/requests/${requestId}`, { data: { user: userData, reason } });
  },
  
  // User management for requests
  acceptUser: async (userData, requestId, userId) => {
    return api.put(`/requests/${requestId}/users/${userId}/accept`, { user: userData });
  },
  
  rejectUser: async (userData, requestId, userId) => {
    return api.put(`/requests/${requestId}/users/${userId}/reject`, { user: userData });
  }
};

// Chat API functions
export const chatAPI = {
  sendMessage: async (userData, text, profileImage = '') => {
    return api.post('/messages', { text, profileImage, user: userData });
  },
  
  getMessages: async (limit = 50, page = 1) => {
    return api.get('/messages', { params: { limit, page } });
  },
  
  // Direct messaging
  sendDirectMessage: async (userData, recipientClerkId, text) => {
    return api.post('/messages/direct', { recipientClerkId, text, user: userData });
  },
  
  getDirectMessages: async (userData, otherUserId, limit = 50, page = 1) => {
    return api.get(`/messages/direct/${otherUserId}`, { 
      params: { limit, page },
      data: { user: userData }
    });
  }
};

// Feedback API functions
export const feedbackAPI = {
  submitFeedback: async (userData, issueFeedback, improvementFeedback) => {
    return api.post('/feedback', { issueFeedback, improvementFeedback, user: userData });
  },
};

// Admin API functions
export const adminAPI = {
  getStats: async (userData) => {
    return api.get('/admin/stats', { data: { user: userData } });
  },
  
  getAllRequests: async (userData) => {
    return api.get('/admin/requests', { data: { user: userData } });
  },
  
  getAllUsers: async (userData) => {
    return api.get('/admin/users', { data: { user: userData } });
  },
  
  deleteRequest: async (userData, requestId) => {
    return api.delete(`/admin/requests/${requestId}`, { data: { user: userData } });
  },
};