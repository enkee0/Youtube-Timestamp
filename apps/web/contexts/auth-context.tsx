"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuthStorage,
  fetchUser,
  getStoredToken,
  getStoredUser,
  setStoredUser,
  type AuthUser,
} from "@/lib/auth";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setStoredUser(null);
      return;
    }
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      return;
    }
    const fetched = await fetchUser(token);
    if (fetched) {
      setUser(fetched);
      setStoredUser(fetched);
    } else {
      setUser(null);
      setStoredUser(null);
    }
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchUser(token).then((fetched) => {
      if (cancelled) return;
      if (fetched) {
        setUser(fetched);
        setStoredUser(fetched);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, loading, signOut, refreshUser }),
    [user, loading, signOut, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
