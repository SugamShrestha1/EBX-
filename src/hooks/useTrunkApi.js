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

// --- Get all trunks ---
export const useGetTrunks = (params) =>
  useQuery({
    queryKey: ['trunks', params],
    queryFn: () => {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchApi(`${endpoints.trunk}${queryString}`);
    },
  });

// --- Get single trunk by ID ---
export const useGetTrunkById = (id) =>
  useQuery({
    queryKey: ['trunks', id],
    queryFn: () => fetchApi(`${endpoints.trunk}/${id}`),
    enabled: !!id,
  });

// --- Create trunk ---
export const useCreateTrunk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchApi(endpoints.trunk, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trunks'] }),
  });
};

// --- Update trunk ---
export const useUpdateTrunk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      fetchApi(`${endpoints.trunk}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trunks'] }),
  });
};

// --- Delete trunk ---
export const useDeleteTrunk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchApi(`${endpoints.trunk}/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trunks'] }),
  });
};
