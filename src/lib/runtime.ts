export const isZaloRuntime =
  Boolean((window as Window & { APP_ID?: string }).APP_ID) ||
  window.location.hostname === 'h5.zdn.vn';
