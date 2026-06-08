import { useApi } from './useApi';
import { useCallback } from 'react';

export const useDashboardApi = () => {
  const { get } = useApi();

  const getDashboardStats = useCallback(async () => {
    return await get('/dashboard/stats');
  }, [get]);

  const getRecentActivities = useCallback(async () => {
    return await get('/dashboard/activities');
  }, [get]);

  return {
    getDashboardStats,
    getRecentActivities
  };
};
