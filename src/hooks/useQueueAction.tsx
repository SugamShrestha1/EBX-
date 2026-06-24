import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import endpoints from "../constants/APIEndpoints";
import { requestApi } from "../utils/request";
import { APIAuthHeaders2 } from "../API";

// Get all queues
export const useGetQueues = (queryParams: any = {}) => {

    // Construct query string
    const queryString = new URLSearchParams(
        Object.entries(queryParams).reduce((acc: any, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key] = String(value);
            }
            return acc;
        }, {})
    ).toString();

    const url = queryString ? `${endpoints.queue}?${queryString}` : endpoints.queue;

    const query = useQuery({
        queryKey: ["queues", queryParams],
        queryFn: () => requestApi(url),
        refetchOnWindowFocus: false,
    });

    return query;
};

// Create queue
export const useCreateQueue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => requestApi(endpoints.queue, {
            method: "POST",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2()
        }),
        onSuccess: (responseData: any) => {
            const newItem = responseData?.data ?? responseData;
            queryClient.setQueriesData(
                { queryKey: ["queues"], exact: false },
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

// Update queue
export const useUpdateQueue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number, data: any }) => requestApi(`${endpoints.queue}${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2()
        }),
        onSuccess: (responseData: any) => {
            const updatedItem = responseData?.data ?? responseData;
            queryClient.setQueriesData({ queryKey: ["queues"] }, (oldData: any) => {
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

// Delete queue
export const useDeleteQueue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => requestApi(`${endpoints.queue}${id}/`, {
            method: "DELETE",
            headers: APIAuthHeaders2()
        }),
        onSuccess: (_, id) => {
            queryClient.setQueriesData({ queryKey: ["queues"] }, (oldData: any) => {
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

// Toggle queue status
export const useToggleQueueStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => requestApi(`${endpoints.queue}${id}/toggle/`, {
            method: "PATCH",
            headers: APIAuthHeaders2()
        }),
        onSuccess: (responseData: any, id) => {
            const updatedData = responseData?.data ?? responseData;
            const { field, new_value } = updatedData;
            if (!field) return;

            queryClient.setQueriesData({ queryKey: ["queues"] }, (oldData: any) => {
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

export const useGetQueueMember = (queryParams: any = {}) => {
    const queryString = new URLSearchParams(
        Object.entries(queryParams).reduce((acc: any, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key] = String(value);
            }
            return acc;
        }, {})
    ).toString();

    const url = queryString ? `${endpoints.queueMember}?${queryString}` : endpoints.queueMember;

    const query = useQuery({
        queryKey: ["queue-members", queryParams],
        queryFn: () => requestApi(url),
        refetchOnWindowFocus: false,
    });

    return query;
};

export const useCreateQueueMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => requestApi(endpoints.queueMember, {
            method: "POST",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2()
        }),
        onSuccess: (responseData: any) => {
            const newItem = responseData?.data ?? responseData;
            queryClient.setQueriesData(
                { queryKey: ["queue-members"], exact: false },
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
}

export const useUpdateQueueMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: any }) =>
            requestApi(`${endpoints.queueMember}${id}/`, {
                method: "PATCH",
                body: JSON.stringify(data),
                headers: APIAuthHeaders2(),
            }),
        onSuccess: (response) => {
            const updatedItem = response.data;

            queryClient.setQueriesData(
                { queryKey: ["queue-members"] },
                (oldData) => {
                    if (!oldData?.data) return oldData;

                    return {
                        ...oldData,
                        data: oldData.data.map((item) =>
                            item.reference_id === updatedItem.reference_id
                                ? { ...item, ...updatedItem }
                                : item
                        ),
                    };
                }
            );
        }
    });
};

export const useDeleteQueueMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => requestApi(`${endpoints.queueMember}${id}/`, {
            method: "DELETE",
            headers: APIAuthHeaders2()
        }),
        onSuccess: (_, id) => {
            queryClient.setQueriesData({ queryKey: ["queue-members"] }, (oldData: any) => {
                if (!oldData) return oldData;
                const filterFn = (q: any) => q.id !== id && q.reference_id !== id;
                if (Array.isArray(oldData)) return oldData.filter(filterFn);
                if (oldData.data) return { ...oldData, data: oldData.data.filter(filterFn) };
                if (oldData.results) return { ...oldData, results: oldData.results.filter(filterFn) };
                return oldData;
            });
        }
    });
}


export const useBUlkDelelteQueueMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => requestApi(`${endpoints.queueMember}bulk-delete/`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2(),
        }),
        onSuccess: (_response, variables) => {
            // variables is whatever you passed into mutate() — 
            // adjust this to match the actual shape (e.g. { reference_ids: [...] })
            const deletedIds: string[] = variables?.reference_ids ?? variables?.ids ?? [];

            queryClient.setQueriesData(
                { queryKey: ["queue-members"] },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;

                    return {
                        ...oldData,
                        data: oldData.data.filter(
                            (member: any) => !deletedIds.includes(member.reference_id)
                        ),
                    };
                }
            );
        },
    });
};

export const useToggleQueueMemberStatus = (setToggleOverrides: any) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => requestApi(`${endpoints.queueMember}${id}/toggle/`, {
            method: "PATCH",
            headers: APIAuthHeaders2()
        }),
        onSuccess: (responseData: any, id) => {
            console.log(responseData, "response")
            const { id: responseId, new_value } = responseData?.data ?? {};

            setToggleOverrides((prev: Record<string, boolean>) => ({
                ...prev,
                [responseId]: new_value,
            }));
            // setToggleOverrides(responseData?.data)

            // const updatedData = responseData?.data ?? responseData;
            // const { field, new_value } = updatedData;
            // if (!field) return;

            // queryClient.setQueriesData({ queryKey: ["queue-members"] }, (oldData: any) => {
            //     if (!oldData) return oldData;
            //     const mapFn = (q: any) => (q.id === id || q.reference_id === id) ? { ...q, [field]: new_value } : q;
            //     if (Array.isArray(oldData)) return oldData.map(mapFn);
            //     if (oldData.data) return { ...oldData, data: oldData.data.map(mapFn) };
            //     if (oldData.results) return { ...oldData, results: oldData.results.map(mapFn) };
            //     return oldData;
            // });
        }
    });
}