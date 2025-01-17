export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export const API_DEFAULT_CONFIG: ApiConfig = {
  baseURL: '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
