import {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import useInterfaceStore from '@/stores/interface';
import { AppError, ErrorLevel } from '@/types/errors.ts';
import { core } from '@/lib/core.tsx';

export const setupRequestInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const scenarioId = useInterfaceStore.getState().scenarioId;
    if (!scenarioId) {
      throw new AppError('Scenario must be loaded', ErrorLevel.CRITICAL);
    }

    const headers = new AxiosHeaders(config.headers);
    headers.set('scenarioId', scenarioId.toString());

    return {
      ...config,
      headers,
    };
  });
};

export const setupResponseInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        await core.authClient.login();
        const config = error.config as InternalAxiosRequestConfig;
        if (config) {
          return instance(config);
        }
      }
      throw error;
    },
  );
};
