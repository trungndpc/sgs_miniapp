import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { config } from './config';
import { authStorage } from './authStorage';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** Re-login via Zalo when JWT expires. Set from AuthContext to avoid circular imports. */
let reauthHandler: (() => Promise<boolean>) | null = null;

export function setReauthHandler(handler: (() => Promise<boolean>) | null) {
  reauthHandler = handler;
}

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
    async (error: AxiosError) => {
      const original = error.config as RetryConfig | undefined;
      if (!original || error.response?.status !== 401 || original._retry) {
        return Promise.reject(error);
      }
      const url = original.url || '';
      if (url.includes('/auth/zalo')) {
        return Promise.reject(error);
      }
      if (!reauthHandler) {
        authStorage.clear();
        return Promise.reject(error);
      }
      original._retry = true;
      const ok = await reauthHandler();
      if (!ok) {
        authStorage.clear();
        return Promise.reject(error);
      }
      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${authStorage.getAccessToken()}`;
      return client.request(original);
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
