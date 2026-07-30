/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IDENTITY_API_BASE_URL: string;
  readonly VITE_CONTENT_API_BASE_URL: string;
  readonly VITE_TENANT_CODE: string;
  readonly VITE_ZALO_AUTH_DEV_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
