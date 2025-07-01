import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config: { headers: { Authorization: string; }; }) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response: any) => response,
  async (error: { config: any; response: { status: number; }; }) => {
    const originalRequest = error.config;
    
    // Only handle 401 errors for specific endpoints
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('/auth/')) {
      
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        
        const response = await apiClient.post('/auth/refresh-token', { refreshToken });
        
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        // Only redirect if not already on login page
        if (!window.location.pathname.startsWith('/auth/login')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;