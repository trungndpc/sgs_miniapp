export const config = {
  identityBaseUrl: import.meta.env.VITE_IDENTITY_API_BASE_URL ?? 'http://localhost:8080',
  contentBaseUrl: import.meta.env.VITE_CONTENT_API_BASE_URL ?? 'http://localhost:8082',
  tenantCode: import.meta.env.VITE_TENANT_CODE ?? 'sgs',
  zaloAuthDevMode: (import.meta.env.VITE_ZALO_AUTH_DEV_MODE ?? 'true') === 'true',
};
