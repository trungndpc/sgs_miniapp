import { authorize } from 'zmp-sdk';
import { getAccessToken, getPhoneNumber, getUserInfo } from 'zmp-sdk/apis';

export type ZaloQuickProfile = {
  accessToken: string;
  zaloId: string;
  name: string;
  avatar: string;
  /** Raw phone if SDK returns it (rare / web stub). Prefer phoneToken. */
  phone: string;
  /** One-time token — server exchanges via Graph /me/info */
  phoneToken: string;
};

/**
 * Zalo Mini App permission + profile flow:
 * 1. authorize(scope.userInfo [, scope.userPhonenumber])
 * 2. getAccessToken — identify user on server
 * 3. getUserInfo — name, avatar
 * 4. getPhoneNumber — phone token (exchange on server; never call Graph from Mini App)
 *
 * Docs: https://docs.zaloplatforms.com/docs/MA/api/user/user-information/getPhoneNumber
 */
export async function collectZaloProfile(options?: {
  withPhone?: boolean;
}): Promise<ZaloQuickProfile> {
  const withPhone = options?.withPhone ?? false;
  const scopes = withPhone
    ? (['scope.userInfo', 'scope.userPhonenumber'] as const)
    : (['scope.userInfo'] as const);

  try {
    await authorize({ scopes: [...scopes] });
  } catch {
    // User may deny some scopes; continue and fill what we can.
  }

  let accessToken = '';
  try {
    accessToken = (await getAccessToken({})) || '';
  } catch {
    accessToken = '';
  }

  let zaloId = '';
  let name = '';
  let avatar = '';
  try {
    const { userInfo } = await getUserInfo({
      autoRequestPermission: true,
      avatarType: 'normal',
    });
    zaloId = userInfo?.id || '';
    name = userInfo?.name || '';
    avatar = userInfo?.avatar || '';
  } catch {
    // Denied name/avatar (-1401) — still can auth by access_token.
  }

  let phone = '';
  let phoneToken = '';
  if (withPhone) {
    try {
      const phoneRes = await getPhoneNumber({});
      phoneToken = phoneRes.token || '';
      phone = phoneRes.number || '';
    } catch {
      // Denied phone — user can type manually.
    }
  }

  return { accessToken, zaloId, name, avatar, phone, phoneToken };
}
