const ACCESS_TOKEN_KEY = 'sgs_access_token';
const IS_MEMBER_KEY = 'sgs_is_member';

/** Session storage — Galaxy access JWT only. No refresh token. */
export const authStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(IS_MEMBER_KEY);
  },
  getIsMember(): boolean {
    return localStorage.getItem(IS_MEMBER_KEY) === '1';
  },
  setIsMember(value: boolean) {
    localStorage.setItem(IS_MEMBER_KEY, value ? '1' : '0');
  },
};
