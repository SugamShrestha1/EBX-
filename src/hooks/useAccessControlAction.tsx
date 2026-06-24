import { requestApi } from "../utils/request";
import endpoints from "../constants/APIEndpoints";
import { APIAuthHeaders2 } from "../API";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetRoles = (queryParams: any = {}) => {
    const queryString = new URLSearchParams(
        Object.entries(queryParams).reduce((acc: any, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key] = String(value);
            }
            return acc;
        }, {})
    ).toString();

    const url = queryString ? `${endpoints.roles}?${queryString}` : endpoints.roles;

    const query = useQuery({
        queryKey: ["roles", queryParams],
        queryFn: () => requestApi(url, { headers: APIAuthHeaders2() }),
        refetchOnWindowFocus: false,
    });

    return query;
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => requestApi(endpoints.roles, {
            method: "POST",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2()
        }),
        onSuccess: (responseData: any) => {
            queryClient.setQueriesData(
                { queryKey: ["roles"], exact: false },
                (oldData: any) => {
                    if (!oldData) return oldData;
                    const newItem = responseData?.data ?? responseData;
                    return {
                        ...oldData,
                        data: [newItem, ...(oldData.data ?? [])],
                    };
                }
            );
        }
    });
};

export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number, data: any }) => requestApi(`${endpoints.roles}${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2()
        }),
        onSuccess: (responseData: any) => {
            const updatedItem = responseData?.data ?? responseData;
            queryClient.setQueriesData({ queryKey: ["roles"] }, (oldData: any) => {
                if (!oldData) return oldData;
                const mapFn = (q: any) => (q.id === updatedItem.id || q.reference_id === updatedItem.reference_id) ? { ...q, ...updatedItem } : q;
                if (Array.isArray(oldData)) return oldData.map(mapFn);
                if (oldData.data) return { ...oldData, data: oldData.data.map(mapFn) };
                if (oldData.results) return { ...oldData, results: oldData.results.map(mapFn) };
                return oldData;
            });
        }
    });
};

export const useDeleteRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => requestApi(`${endpoints.roles}${id}/`, {
            method: "DELETE",
            headers: APIAuthHeaders2()
        }),
        onSuccess: (_, id) => {
            queryClient.setQueriesData({ queryKey: ["roles"] }, (oldData: any) => {
                if (!oldData) return oldData;
                const filterFn = (q: any) => q.id !== id && q.reference_id !== id;
                if (Array.isArray(oldData)) return oldData.filter(filterFn);
                if (oldData.data) return { ...oldData, data: oldData.data.filter(filterFn) };
                if (oldData.results) return { ...oldData, results: oldData.results.filter(filterFn) };
                return oldData;
            });
        }
    });
};

export const useToggleRoleStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => requestApi(`${endpoints.roles}${id}/toggle/`, {
            method: "PATCH",
            body: JSON.stringify({ id }),
            headers: APIAuthHeaders2()
        }),
        onSuccess: (responseData: any, id) => {
            const updatedData = responseData?.data ?? responseData;
            const { field, new_value } = updatedData;
            if (!field) return;

            queryClient.setQueriesData({ queryKey: ["roles"] }, (oldData: any) => {
                if (!oldData) return oldData;
                const mapFn = (q: any) => (q.id === id || q.reference_id === id) ? { ...q, [field]: new_value } : q;
                if (Array.isArray(oldData)) return oldData.map(mapFn);
                if (oldData.data) return { ...oldData, data: oldData.data.map(mapFn) };
                if (oldData.results) return { ...oldData, results: oldData.results.map(mapFn) };
                return oldData;
            });
        }
    });
};