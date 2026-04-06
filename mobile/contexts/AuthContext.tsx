import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthUser } from '@/types/types';

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_USERS: Record<string, string> = {
  admin: 'mmi2026',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    const valid = VALID_USERS[username] === password;
    if (valid) {
      setUser({ username, token: `token-${username}-${Date.now()}` });
    }
    return valid;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
