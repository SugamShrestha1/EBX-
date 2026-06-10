import { useMutation } from '@tanstack/react-query';
import endpoints from '../constants/APIEndpoinits';
import { requestApi } from '../utils/request';
import { useSessionStore } from '../pages/session/useSessionStore';
// const fetchApi = async (url, options = {}) => {
//   const token = localStorage.getItem('token');
//   const headers = {
//     'Content-Type': 'application/json',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     ...options.headers,
//   };

//   const response = await fetch(url, { ...options, headers });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => null);
//     throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
//   }

//   return response.status === 204 ? null : response.json();
// };

// --- Auth: Login ---
export const useLogin = () =>
  useMutation({
    mutationFn: ({ username, password }) =>
      requestApi(endpoints.login, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
        noAuth: true,
      }),
  });

// --- Auth: Signup ---
export const useSignup = () =>
  useMutation({
    mutationFn: (userData) =>
      requestApi(endpoints.signup, {
        method: 'POST',
        body: JSON.stringify(userData),
        noAuth: true,
      }),
  });

// --- Auth: Logout ---
const buildAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const useLogout = () =>
  useMutation({
    mutationFn: () =>
      requestApi(endpoints.logout, {
        method: 'POST',
        headers: buildAuthHeaders(),
        body: JSON.stringify({ refresh: localStorage.getItem('refresh_token') }),
      }),
    onSettled: () => {
      // Always clear all tokens regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('ebxdata');
    },
  });

export const refreshAuthToken = async (refreshValue = localStorage.getItem('refresh_token')) => {
  if (!refreshValue) {
    return null;
  }

  try {
    const response = await requestApi(endpoints.tokenRefresh, {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshValue }),
      headers: {
        'Content-Type': 'application/json',
      },
      noAuth: true,
    });

    const data = response?.data ?? response;
    const access = data?.access ?? null;
    const refresh = data?.refresh ?? null;
    const authExpiry = data?.authExpiry ?? null;
    const refreshExpiry = data?.refreshExpiry ?? null;

    if (access) {
      localStorage.setItem('token', access);
    }
    if (refresh) {
      localStorage.setItem('refresh_token', refresh);
    }

    const { setSession } = useSessionStore.getState();
    setSession({
      access,
      refresh,
      authExpiry,
      refreshExpiry,
    });

    return data;
  } catch (error) {
    console.error('refreshAuthToken failed:', error);
    return null;
  }
};
