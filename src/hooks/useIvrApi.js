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

// --- Get all IVRs ---
export const useGetIvrs = (params) =>
  useQuery({
    queryKey: ['ivrs', params],
    queryFn: () => {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchApi(`${endpoints.ivr}${queryString}`);
    },
  });

// --- Get single IVR by ID ---
export const useGetIvrById = (id) =>
  useQuery({
    queryKey: ['ivrs', id],
    queryFn: () => fetchApi(`${endpoints.ivr}/${id}`),
    enabled: !!id,
  });

// --- Create IVR ---
export const useCreateIvr = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchApi(endpoints.ivr, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ivrs'] }),
  });
};

// --- Update IVR ---
export const useUpdateIvr = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      fetchApi(`${endpoints.ivr}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ivrs'] }),
  });
};

// --- Delete IVR ---
export const useDeleteIvr = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchApi(`${endpoints.ivr}/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ivrs'] }),
  });
};
