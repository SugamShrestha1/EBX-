import { useApi } from './useApi';
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { requestApi } from '../utils/request';
import { APIAuthHeaders2 } from '../API';
import endpoints from '../constants/APIEndpoints';


export const useUserData = () => {
  return useQuery({
    queryKey: ["users_list"],
    queryFn: () => {
      return requestApi(`${endpoints.users}`, {
        method: "GET",
        headers: APIAuthHeaders2(),
      });
    }
  });
};

export const useGetMenus = () => {
  return useQuery({
    queryKey: ["menus_list"],
    queryFn: () => {
      return requestApi(`${endpoints.menus}`, {
        method: "GET",
        headers: APIAuthHeaders2(),
      });
    }
  });
}