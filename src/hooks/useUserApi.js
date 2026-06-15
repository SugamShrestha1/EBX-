import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import endpoints from '../constants/APIEndpoinits';
import { useSessionStore } from '../pages/session/useSessionStore';
import { APIAuthHeaders2 } from '../API';
import { requestApi } from '../utils/request';
import { useUsersStore } from "../pages/Users/useUserStore"
import { useEffect } from 'react';

// --- Get all users ---
export const useGetUsers = (params) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      return requestApi(`${endpoints.users}${queryString}`);
    },
  });

// --- Get simple users (e.g. for dropdowns) ---
export const useGetSimpleUsers = () =>
  useQuery({
    queryKey: ['users', 'simple'],
    queryFn: () => requestApi(`${endpoints.users}simple/`),
  });

// --- Get single user by ID ---
export const useGetUserById = (id) =>
  useQuery({
    queryKey: ['users', id],
    queryFn: () => requestApi(endpoints.userById(id)),
    enabled: !!id,
  });

// --- Create user ---
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      requestApi(endpoints.users, { method: 'POST', headers: APIAuthHeaders2(), body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

// --- Update user (Partial Update) ---
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      requestApi(endpoints.userById(id), {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: APIAuthHeaders2(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

// --- Delete single user ---
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      requestApi(endpoints.userById(id), {
        method: 'DELETE',
        headers: APIAuthHeaders2(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

// --- Bulk delete users ---
export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) =>
      requestApi(endpoints.userBulkDelete, {
        method: 'POST',
        body: JSON.stringify({ ids }),
        headers: APIAuthHeaders2(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

// --- Toggle user field (e.g. is_active) ---
export const useToggleUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, field }) =>
      requestApi(endpoints.userToggle(id), {
        method: 'PATCH',
        body: JSON.stringify({ field }),
        headers: APIAuthHeaders2(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

// --- Create department ---
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      requestApi(endpoints.departments, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: APIAuthHeaders2(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
};

// --- Get all departments ---
export const useGetDepartments = (params) => {
  const { setDepartments } = useUsersStore();

  const query = useQuery({
    queryKey: ['departments', params],
    queryFn: () => {
      const queryString = params
        ? '?' + new URLSearchParams(params).toString()
        : '';

      return requestApi(`${endpoints.departments}${queryString}`);
    },
  });

  const { data, isSuccess } = query;

  useEffect(() => {
    if (!isSuccess) return;

    console.log(data, 'data from useGetDepartments');

    if (data?.data) {
      setDepartments(data.data);
    } else if (Array.isArray(data)) {
      setDepartments(data);
    } else if (data?.results) {
      setDepartments(data.results);
    }
  }, [isSuccess, data, setDepartments]);

  return query;
};
// --- Get simple departments (e.g. for dropdowns) ---
export const useGetSimpleDepartments = () =>
  useQuery({
    queryKey: ['departments', 'simple'],
    queryFn: () => requestApi(endpoints.departmentSimple),
  });


// --- Get single department by ID ---
export const useGetDepartmentById = (id) =>
  useQuery({
    queryKey: ['departments', id],
    queryFn: () => requestApi(endpoints.departmentById(id)),
    enabled: !!id,
  });

// --- Update department (Partial Update) ---
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      requestApi(endpoints.departmentById(id), {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: APIAuthHeaders2(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
};

// --- Delete single department ---
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      requestApi(endpoints.departmentById(id), {
        method: 'DELETE',
        headers: APIAuthHeaders2(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
};

// --- Bulk delete departments ---
export const useBulkDeleteDepartments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) =>
      requestApi(endpoints.departmentBulkDelete, {
        method: 'POST',
        body: JSON.stringify({ ids }),
        headers: APIAuthHeaders2(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
};

// --- Toggle department field (e.g. is_active) ---
export const useToggleDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, field }) =>
      requestApi(endpoints.departmentToggle(id), {
        method: 'PATCH',
        body: JSON.stringify({ field }),
        headers: APIAuthHeaders2(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
};