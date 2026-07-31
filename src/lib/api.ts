import axios, { type AxiosError } from 'axios';
import { config } from './config';
import { authStorage } from './authStorage';

function createClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((req) => {
    req.headers['X-Tenant-Code'] = config.tenantCode;
    const accessToken = authStorage.getAccessToken();
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
  });

  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        authStorage.clear();
      }
      return Promise.reject(error);
    },
  );

  return client;
}

export const identityApi = createClient(config.identityBaseUrl);
export const contentApi = createClient(config.contentBaseUrl);

export async function unwrap<T>(promise: Promise<{ data: { success: boolean; data: T } }>) {
  const { data } = await promise;
  return data.data;
}
