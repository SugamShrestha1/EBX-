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

// --- Get all music on hold entries ---
export const useGetMusicOnHold = (params) =>
  useQuery({
    queryKey: ['music-on-hold', params],
    queryFn: () => {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchApi(`${endpoints.music_on_hold}${queryString}`);
    },
  });

// --- Get single music on hold entry by ID ---
export const useGetMusicOnHoldById = (id) =>
  useQuery({
    queryKey: ['music-on-hold', id],
    queryFn: () => fetchApi(`${endpoints.music_on_hold}/${id}`),
    enabled: !!id,
  });

// --- Create music on hold entry ---
export const useCreateMusicOnHold = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchApi(endpoints.music_on_hold, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['music-on-hold'] }),
  });
};

// --- Update music on hold entry ---
export const useUpdateMusicOnHold = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      fetchApi(`${endpoints.music_on_hold}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['music-on-hold'] }),
  });
};

// --- Delete music on hold entry ---
export const useDeleteMusicOnHold = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchApi(`${endpoints.music_on_hold}/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['music-on-hold'] }),
  });
};
