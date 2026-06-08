import { useCallback } from 'react';

// A base URL could be placed here or read from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const useApi = () => {
  const request = useCallback(async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }, []);

  const get = useCallback((endpoint, options) => request(endpoint, { method: 'GET', ...options }), [request]);
  const post = useCallback((endpoint, body, options) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }), [request]);
  const put = useCallback((endpoint, body, options) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }), [request]);
  const del = useCallback((endpoint, options) => request(endpoint, { method: 'DELETE', ...options }), [request]);

  return { request, get, post, put, del };
};
