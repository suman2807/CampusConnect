import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



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