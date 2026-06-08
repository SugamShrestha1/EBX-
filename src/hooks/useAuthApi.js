import { useMutation } from '@tanstack/react-query';
import endpoints from '../constants/APIEndpoinits';

const fetchApi = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
  }

  return response.status === 204 ? null : response.json();
};

// --- Auth: Login ---
export const useLogin = () =>
  useMutation({
    mutationFn: ({ username, password }) =>
      fetchApi(endpoints.login, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
  });

// --- Auth: Signup ---
export const useSignup = () =>
  useMutation({
    mutationFn: (userData) =>
      fetchApi(endpoints.signup, {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
  });
