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

// --- Get all announcements ---
export const useGetAnnouncements = (params) =>
  useQuery({
    queryKey: ['announcements', params],
    queryFn: () => {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchApi(`${endpoints.announcement}${queryString}`);
    },
  });

// --- Get single announcement by ID ---
export const useGetAnnouncementById = (id) =>
  useQuery({
    queryKey: ['announcements', id],
    queryFn: () => fetchApi(`${endpoints.announcement}/${id}`),
    enabled: !!id,
  });

// --- Create announcement ---
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchApi(endpoints.announcement, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
  });
};

// --- Update announcement ---
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      fetchApi(`${endpoints.announcement}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
  });
};

// --- Delete announcement ---
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchApi(`${endpoints.announcement}/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
  });
};
