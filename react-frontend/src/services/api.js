import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Design API
export const designApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  generateDesign: (file, params) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add design parameters
    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    });
    
    return api.post('/design', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  saveDesign: (designId, name) => {
    return api.post('/save-design', { designId, name });
  },
};

// Knowledge Base API
export const knowledgeBaseApi = {
  getFiles: () => {
    return api.get('/knowledge-files');
  },
  
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload-knowledge-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteFile: (fileId) => {
    return api.delete(`/knowledge-file/${fileId}`);
  },
  
  queryKnowledge: (query) => {
    return api.post('/query-knowledge', { query });
  },
};

// Product Copy API
export const productCopyApi = {
  generateCopy: (params) => {
    return api.post('/product-copy', params);
  },
  
  saveCopy: (copyId, name) => {
    return api.post('/save-copy', { copyId, name });
  },
};

// Image Understanding API
export const imageUnderstandingApi = {
  analyzeImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/image-understanding', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Settings API
export const settingsApi = {
  getSettings: () => {
    return api.get('/settings');
  },
  
  updateSettings: (settings) => {
    return api.post('/settings', settings);
  },
};

// Auth API
export const authApi = {
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  
  logout: () => {
    return api.post('/auth/logout');
  },
  
  getCurrentUser: () => {
    return api.get('/auth/user');
  },
  
  getPointsBalance: () => {
    return api.get('/auth/points');
  },
  
  getPointsHistory: () => {
    return api.get('/auth/points/history');
  },
  
  addPoints: (amount) => {
    return api.post('/auth/points/add', { amount });
  },
};

// Export all APIs
export default {
  design: designApi,
  knowledgeBase: knowledgeBaseApi,
  productCopy: productCopyApi,
  imageUnderstanding: imageUnderstandingApi,
  settings: settingsApi,
  auth: authApi,
};
