import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, setAuthToken } from '../lib/api';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('car-hire-user');
    const storedToken = localStorage.getItem('car-hire-token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const mappedUser: User = {
        id: data._id,
        email: data.email,
        name: data.name,
        phone: '',
        role: (data.role || 'client').toLowerCase(),
        created_at: new Date().toISOString(),
      } as unknown as User;

      setUser(mappedUser);
      localStorage.setItem('car-hire-user', JSON.stringify(mappedUser));
      localStorage.setItem('car-hire-token', data.token);
      setAuthToken(data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('car-hire-user');
    localStorage.removeItem('car-hire-token');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}