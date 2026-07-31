import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authStorage } from '@/lib/authStorage';
import { setReauthHandler } from '@/lib/api';
import { isZaloRuntime } from '@/lib/runtime';
import { fetchMe, loginWithZalo, type GalaxyUser } from '@/services/identity';

interface AuthState {
  loading: boolean;
  user: GalaxyUser | null;
  isMember: boolean;
  refresh: () => Promise<void>;
  ensureLogin: () => Promise<GalaxyUser | null>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<GalaxyUser | null>(null);
  const [isMember, setIsMember] = useState(authStorage.getIsMember());

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (!authStorage.getAccessToken()) {
        if (!isZaloRuntime) {
          setUser(null);
          return;
        }
        const result = await loginWithZalo({ withPhone: false });
        setUser(result.user);
        setIsMember(result.is_member);
        return;
      }
      const me = await fetchMe();
      setUser(me);
      const member = Boolean(me.roles?.some((r) => r.code === 'member'));
      setIsMember(member);
      authStorage.setIsMember(member);
    } catch {
      try {
        if (!isZaloRuntime) {
          authStorage.clear();
          setUser(null);
          return;
        }
        const result = await loginWithZalo({ withPhone: false });
        setUser(result.user);
        setIsMember(result.is_member);
      } catch {
        authStorage.clear();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const ensureLogin = useCallback(async () => {
    if (user) return user;
    if (!isZaloRuntime) {
      throw new Error('Hãy mở Mini App trong Zalo để đăng nhập.');
    }
    const result = await loginWithZalo({ withPhone: false });
    setUser(result.user);
    setIsMember(result.is_member);
    return result.user;
  }, [user]);

  useEffect(() => {
    setReauthHandler(async () => {
      if (!isZaloRuntime) return false;
      try {
        const result = await loginWithZalo({ withPhone: false });
        setUser(result.user);
        setIsMember(result.is_member);
        return true;
      } catch {
        return false;
      }
    });
    return () => setReauthHandler(null);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ loading, user, isMember, refresh, ensureLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
