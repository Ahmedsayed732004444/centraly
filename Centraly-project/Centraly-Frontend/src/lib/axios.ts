import axios from 'axios';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7073';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Global error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const token = storage.getToken();
      const refreshToken = storage.getRefreshToken();

      if (token && refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
            token,
            refreshToken
          });
          
          storage.setToken(data.token);
          storage.setRefreshToken(data.refreshToken);
          if (data.permissions) {
             storage.setPermissions(data.permissions);
          }
          apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
          originalRequest.headers.Authorization = 'Bearer ' + data.token;
          
          processQueue(null, data.token);
          return apiClient(originalRequest);
        } catch (err) {
          processQueue(err, null);
          storage.clearToken();
          storage.clearRefreshToken();
          storage.clearPermissions();
          window.location.href = '/login';
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        storage.clearToken();
        storage.clearRefreshToken();
        storage.clearPermissions();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    } else if (error.response?.status >= 500) {
      toast.error('حدث خطأ في الخادم (Server Error).');
    }
    return Promise.reject(error);
  }
);

