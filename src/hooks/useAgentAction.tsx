import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import endpoints from "../constants/APIEndpoints";
import { requestApi } from "../utils/request";
import { useAgentStore } from "../pages/Agents/useAgentStore";
import { APIAuthHeaders2 } from "../API";
//get all agents
export const useGetAgents = (queryParams = {}) => {
    const { setAgents } = useAgentStore();

    // Construct query string
    const queryString = new URLSearchParams(
        Object.entries(queryParams).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key] = String(value);
            }
            return acc;
        }, {})
    ).toString();

    const url = queryString ? `${endpoints.agent}?${queryString}` : endpoints.agent;

    const query = useQuery({
        queryKey: ["agents", queryParams],
        queryFn: () => requestApi(url),
        refetchOnWindowFocus: false,
    });
    useEffect(() => {

        if (query.status === "success" && query.data) {
            const results = query?.data?.data;
            setAgents(results)
            // useAgentStore.getState().setAgents(results);
        }
    }, [query.data]);
    return query;


};

//create agent
export const useCreateAgent = () => {
    return useMutation({
        mutationFn: (data) => requestApi(endpoints.agent, {
            method: "POST",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2
        }),
    });
};

//update agent
export const useUpdateAgent = () => {
    return useMutation({
        mutationFn: ({ id, data }) => requestApi(`${endpoints.agent}${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2
        }),
    });
};

//delete agent
export const useDeleteAgent = () => {
    return useMutation({
        mutationFn: (id) => requestApi(`${endpoints.agent}${id}/`, {
            method: "DELETE",
        }),
    });
};

// 
export const useToggleAgentStatus = () => {
    const updateAgentStore = useAgentStore((state) => state.updateAgent);

    return useMutation({
        mutationFn: (id) => requestApi(`${endpoints.agent}${id}/toggle/`, {
            method: "PATCH",
            headers: APIAuthHeaders2
        }),
        onSuccess: (responseData, id) => {
            const updatedData = responseData?.data ?? responseData;
            const { field, new_value } = updatedData;

            // Only update the specific field that changed e.g. { is_active: false }
            updateAgentStore(id, { [field]: new_value });
        }
    });
};
