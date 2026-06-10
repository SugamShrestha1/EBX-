import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import endpoints from '../constants/APIEndpoinits';
import { useSessionStore } from '../pages/session/useSessionStore';
import { APIAuthHeaders2 } from '../API';

const fetchApi = async (url, options = {}) => {
  const { access } = useSessionStore.getState();
  const token = access || localStorage.getItem('token');
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

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  // Some endpoints might return empty response body even with 200/201, so we try-catch JSON parsing
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
};

// --- Get all users ---
export const useGetUsers = (params) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchApi(`${endpoints.users}${queryString}`);
    },
  });

// --- Get simple users (e.g. for dropdowns) ---
export const useGetSimpleUsers = () =>
  useQuery({
    queryKey: ['users', 'simple'],
    queryFn: () => fetchApi(`${endpoints.users}simple/`),
  });

// --- Get single user by ID ---
export const useGetUserById = (id) =>
  useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchApi(endpoints.userById(id)),
    enabled: !!id,
  });

// --- Create user ---
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchApi(endpoints.users, { method: 'POST', headers:APIAuthHeaders2(),body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

// --- Update user (Partial Update) ---
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      fetchApi(endpoints.userById(id), { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

// --- Delete single user ---
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchApi(endpoints.userById(id), { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

// --- Bulk delete users ---
export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) =>
      fetchApi(endpoints.userBulkDelete, {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

// --- Toggle user field (e.g. is_active) ---
export const useToggleUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, field }) =>
      fetchApi(endpoints.userToggle(id), {
        method: 'PATCH',
        body: JSON.stringify({ field }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
