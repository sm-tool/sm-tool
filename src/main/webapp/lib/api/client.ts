import Axios, { AxiosRequestConfig } from 'axios';
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from '@/lib/api/interceptors.ts';
import { API_DEFAULT_CONFIG, ApiConfig } from '@/lib/api/config.ts';
import { API_INSTANCE } from '@/lib/api/index.ts';

export const createAxiosInstance = (config?: ApiConfig) => {
  const instance = Axios.create({
    ...API_DEFAULT_CONFIG,
    ...config,
  });

  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);

  return instance;
};

export const createApiClient = (instance = API_INSTANCE) => {
  return <T>(
    configuration: AxiosRequestConfig,
  ): Promise<T> & { cancel: () => void } => {
    const source = Axios.CancelToken.source();

    const promise = instance({
      ...configuration,
      cancelToken: source.token,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Is any
    }).then(({ data }) => data);

    return Object.assign(promise, {
      cancel: () => source.cancel('Operation canceled by cache system or user'),
    });
  };
};
