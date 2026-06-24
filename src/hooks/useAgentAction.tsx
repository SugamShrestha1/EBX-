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
            console.log(query.data, "query data from agent hook")
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

export const useDeleteAgent = () => {
    return useMutation({
        mutationFn: (id) => requestApi(`${endpoints.agent}${id}/`, {
            method: "DELETE",
            headers: APIAuthHeaders2
        }),
    });
};

export const useBulkDelete = () => {
    return useMutation({
        mutationFn: (ids: string[]) => requestApi(`${endpoints.agent}bulk-delete/`, {
            method: "POST",
            body: JSON.stringify({ ids }),
            headers: APIAuthHeaders2
        }),
    });
}

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

export const useGetAgentskills = () => {
    return useQuery({
        queryKey: ["agentskills"],
        queryFn: () => requestApi(`${endpoints.skills}agent-skills/`),
        refetchOnWindowFocus: false,
    });
};

export const useCreateAgentskill = () => {
    return useMutation({
        mutationFn: (data) => requestApi(`${endpoints.skills}agent-skills/`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2
        }),
    });
};

export const useUpdateAgentskill = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => requestApi(`${endpoints.skills}agent-skills/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2
        }),
    });
};

export const useDeleteAgentskill = () => {
    return useMutation({
        mutationFn: (id) => requestApi(`${endpoints.skills}agent-skills/${id}/`, {
            method: "DELETE",
            headers: APIAuthHeaders2
        }),
    });
};

export const useToggleAgentskillStatus = () => {
    return useMutation({
        mutationFn: (id) => requestApi(`${endpoints.skills}agent-skills/${id}/toggle/`, {
            method: "PATCH",
            headers: APIAuthHeaders2,
            body: JSON.stringify({ id })
        }),
    });
};

export const useBulkDeleteAgentSkill = () => {
    return useMutation({
        mutationFn: (ids: string[]) => requestApi(`${endpoints.skills}agent-skills/bulk-delete/`, {
            method: "POST",
            body: JSON.stringify({ ids }),
            headers: APIAuthHeaders2
        }),
    });
}
export const useGetSkills = () => {
    return useQuery({
        queryKey: ["skills"],
        queryFn: () => requestApi(endpoints.skills),
        refetchOnWindowFocus: false,
    });
};

export const useGetSimpleSkills = () => {
    return useQuery({
        queryKey: ["simpleskills"],
        queryFn: () => requestApi(`${endpoints.skills}simple/`),
        refetchOnWindowFocus: false,
    });
};


export const useCreateSkill = () => {
    return useMutation({
        mutationFn: (data) => requestApi(endpoints.skills, {
            method: "POST",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2
        }),
    });
};

export const useUpdateSkill = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => requestApi(`${endpoints.skills}${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: APIAuthHeaders2
        }),
    });
};

export const useDeleteSkill = () => {
    return useMutation({
        mutationFn: (id) => requestApi(`${endpoints.skills}${id}/`, {
            method: "DELETE",
            headers: APIAuthHeaders2
        }),
    });
};

export const useBulkDeleteSkill = () => {
    return useMutation({
        mutationFn: ({ ids }: { ids: string[] }) => requestApi(`${endpoints.skills}bulk-delete/`, {
            method: "POST",
            body: JSON.stringify({ ids }),
            headers: APIAuthHeaders2
        }),
    });
}

export const useToggleSkillStatus = () => {
    return useMutation({
        mutationFn: (id) => requestApi(`${endpoints.skills}${id}/toggle/`, {
            method: "PATCH",
            headers: APIAuthHeaders2
        }),
    });
};

