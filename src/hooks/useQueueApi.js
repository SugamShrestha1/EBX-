import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// --- Get all queues ---
export const useGetQueues = (params) =>
  useQuery({
    queryKey: ['queues', params],
    queryFn: () => {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchApi(`${endpoints.queue}${queryString}`);
    },
  });

// --- Get single queue by ID ---
export const useGetQueueById = (id) =>
  useQuery({
    queryKey: ['queues', id],
    queryFn: () => fetchApi(`${endpoints.queue}/${id}`),
    enabled: !!id,
  });

// --- Create queue ---
export const useCreateQueue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchApi(endpoints.queue, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['queues'] }),
  });
};

// --- Update queue ---
export const useUpdateQueue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      fetchApi(`${endpoints.queue}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['queues'] }),
  });
};

// --- Delete queue ---
export const useDeleteQueue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchApi(`${endpoints.queue}/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['queues'] }),
  });
};
