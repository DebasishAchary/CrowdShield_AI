import axios from 'axios';
import { CONFIG } from '../config/config';

export const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 0,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;