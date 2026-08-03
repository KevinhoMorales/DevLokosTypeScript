'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  loginWithEmail,
  logoutFirebase,
  subscribeAuth,
  type User,
} from '@/lib/firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminChecked: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  refreshAdmin: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchIsAdmin(token: string): Promise<boolean> {
  const res = await fetch('/api/admin/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return false;
  const data = await res.json();
  return Boolean(data.isAdmin);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  const refreshAdmin = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setAdminChecked(true);
      return;
    }
    try {
      const token = await user.getIdToken();
      const admin = await fetchIsAdmin(token);
      setIsAdmin(admin);
    } catch {
      setIsAdmin(false);
    } finally {
      setAdminChecked(true);
    }
  }, [user]);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    try {
      unsub = subscribeAuth((u) => {
        setUser(u);
        setLoading(false);
        if (!u) {
          setIsAdmin(false);
          setAdminChecked(true);
        } else {
          setAdminChecked(false);
        }
      });
    } catch {
      setLoading(false);
      setAdminChecked(true);
    }
    return () => unsub?.();
  }, []);

  useEffect(() => {
    if (user) {
      void refreshAdmin();
    }
  }, [user, refreshAdmin]);

  const login = useCallback(async (email: string, password: string) => {
    await loginWithEmail(email, password);
  }, []);

  const logout = useCallback(async () => {
    await logoutFirebase();
    setIsAdmin(false);
  }, []);

  const getIdToken = useCallback(
    async (forceRefresh = false) => {
      if (!user) return null;
      return user.getIdToken(forceRefresh);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      adminChecked,
      login,
      logout,
      getIdToken,
      refreshAdmin,
    }),
    [user, loading, isAdmin, adminChecked, login, logout, getIdToken, refreshAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
