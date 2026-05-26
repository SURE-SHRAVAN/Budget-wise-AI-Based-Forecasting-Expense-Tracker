import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { tokenStore } from "../lib/tokens";
import { api } from "../services/api";
import type { User } from "../types/finance";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    if (!tokenStore.getAccess()) {
      setLoading(false);
      return;
    }

    try {
      setUser(await api.auth.me());
    } catch {
      tokenStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = async (email: string, password: string) => {
    const response = await api.auth.login({ email, password });
    tokenStore.set(response.access, response.refresh);
    setUser(response.user);
  };

  const register = async (email: string, username: string, password: string) => {
    const response = await api.auth.register({ email, username, password });
    tokenStore.set(response.access, response.refresh);
    setUser(response.user);
  };

  const logout = async () => {
    const refresh = tokenStore.getRefresh();
    try {
      if (refresh) await api.auth.logout(refresh);
    } finally {
      tokenStore.clear();
      setUser(null);
    }
  };

  const updateProfile = async (payload: Partial<User>) => {
    const updated = await api.auth.updateProfile(payload);
    setUser((current) => (current ? { ...current, ...updated } : updated));
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
