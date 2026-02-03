import React, { createContext, useContext, useState, useEffect } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  roles: string[];
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = sessionStorage.getItem('farutech:user');
    if (s) setUser(JSON.parse(s));
  }, []);

  async function login(email: string, _password: string) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const mock: User = {
      id: 'u_1',
      name: 'Demo User',
      email,
      roles: email === 'admin@farutech.com' ? ['admin', 'editor'] : ['editor']
    };
    setUser(mock);
    try { sessionStorage.setItem('farutech:user', JSON.stringify(mock)); } catch {}
    setLoading(false);
    return mock;
  }

  function logout() {
    setUser(null);
    try { sessionStorage.removeItem('farutech:user'); } catch {}
  }

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, login, logout } },
    children
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}