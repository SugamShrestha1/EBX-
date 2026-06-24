import { useMutation, useQuery } from "@tanstack/react-query";
import { requestApi } from "../utils/request";
import endpoints from "../constants/APIEndpoints";
import { APIAuthHeaders, APIAuthHeaders2 } from "../API";

export const useGetOutboundCampaign = () => {
    return useQuery({
        queryKey: ["outbound-campaigns"],
        queryFn: () => requestApi(endpoints.campaign, { headers: APIAuthHeaders2() }),
        refetchOnWindowFocus: false,
    });
};

export const useCreateOutboundCampaign = () => {
    return useMutation({
        mutationFn: (data: any) =>
            requestApi(endpoints.campaign, {
                method: "POST",
                body: JSON.stringify(data),
                headers: APIAuthHeaders2(),
            }),
    });
};

export const useUpdateOutboundCampaign = () => {
    return useMutation({
        mutationFn: (data: any) =>
            requestApi(endpoints.outboundCampaign, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: APIAuthHeaders2(),
            }),
    });
};

export const useDeleteOutboundCampaign = () => {
    return useMutation({
        mutationFn: (reference_id: string) =>
            requestApi(`${endpoints.outboundCampaign}/${reference_id}`, {
                method: "DELETE",
                headers: APIAuthHeaders2(),
            }),
    });
};

export const useToggleOutboundCampaignStatus = () => {
    return useMutation({
        mutationFn: ({ reference_id, is_active }: { reference_id: string; is_active: boolean }) =>
            requestApi(`${endpoints.outboundCampaign}/${reference_id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ is_active }),
                headers: APIAuthHeaders2(),
            }),
    });
};