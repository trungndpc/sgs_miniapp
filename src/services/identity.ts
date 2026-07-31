import { identityApi, unwrap } from '@/lib/api';
import { config } from '@/lib/config';
import { authStorage } from '@/lib/authStorage';
import { collectZaloProfile } from '@/services/zaloProfile';

export interface GalaxyUser {
  id: number;
  full_name: string;
  display_name: string;
  avatar_url: string;
  email: string;
  phone: string;
  city: string;
  ward: string;
  roles?: { code: string }[];
}

export interface ZaloAuthResult {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: GalaxyUser;
  is_member: boolean;
}

type ZaloAuthBody = {
  access_token?: string;
  phone_token?: string;
  zalo_id?: string;
  name?: string;
  avatar_url?: string;
  phone?: string;
};

async function resolveZaloAuthBody(options?: { withPhone?: boolean }): Promise<ZaloAuthBody> {
  const profile = await collectZaloProfile({ withPhone: options?.withPhone });

  if (profile.accessToken) {
    return {
      access_token: profile.accessToken,
      phone_token: profile.phoneToken || undefined,
      name: profile.name || undefined,
      avatar_url: profile.avatar || undefined,
      phone: profile.phone || undefined,
    };
  }

  if (config.zaloAuthDevMode) {
    return {
      zalo_id: profile.zaloId || `dev-local-${Date.now()}`,
      name: profile.name || 'SGS Dev User',
      avatar_url: profile.avatar || '',
      phone: profile.phone || '0900000000',
    };
  }

  throw new Error('Không lấy được Zalo access token. Hãy mở Mini App trong Zalo.');
}

function persistSession(result: ZaloAuthResult) {
  authStorage.setAccessToken(result.access_token);
  authStorage.setIsMember(result.is_member);
}

export async function loginWithZalo(options?: { withPhone?: boolean }): Promise<ZaloAuthResult> {
  const body = await resolveZaloAuthBody(options);
  const result = await unwrap<ZaloAuthResult>(identityApi.post('/api/v1/user/auth/zalo', body));
  persistSession(result);
  return result;
}

export async function fetchMe(): Promise<GalaxyUser> {
  return unwrap<GalaxyUser>(identityApi.get('/api/v1/user/me'));
}

export async function resolveZaloPhone(input: {
  access_token: string;
  phone_token: string;
}): Promise<{ phone: string }> {
  return unwrap<{ phone: string }>(identityApi.post('/api/v1/user/auth/zalo/phone', input));
}

export async function registerMember(input: {
  full_name: string;
  phone: string;
  email: string;
  avatar_url: string;
  city?: string;
  ward?: string;
}): Promise<GalaxyUser> {
  const user = await unwrap<GalaxyUser>(identityApi.post('/api/v1/user/members/register', input));
  authStorage.setIsMember(true);
  return user;
}
