const USER_ID_KEY = 'sgs_user_id';
const IS_MEMBER_KEY = 'sgs_is_member';

export const authStorage = {
  getUserId(): number | null {
    const raw = localStorage.getItem(USER_ID_KEY);
    if (!raw) return null;
    const id = Number(raw);
    return Number.isFinite(id) && id > 0 ? id : null;
  },
  setUserId(id: number) {
    localStorage.setItem(USER_ID_KEY, String(id));
  },
  clear() {
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(IS_MEMBER_KEY);
  },
  getIsMember(): boolean {
    return localStorage.getItem(IS_MEMBER_KEY) === '1';
  },
  setIsMember(value: boolean) {
    localStorage.setItem(IS_MEMBER_KEY, value ? '1' : '0');
  },
};
