import { createApiClient, createAxiosInstance } from '@/lib/api/client.ts';

export const API_INSTANCE = createAxiosInstance();
export const apiClient = createApiClient(API_INSTANCE);
