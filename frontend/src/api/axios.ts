import axios from 'axios';
import { CONFIG } from '../config/config';

export const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silent interceptor for backend status checks
    return Promise.reject(error);
  }
);

export default apiClient;
