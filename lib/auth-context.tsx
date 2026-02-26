'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserProfile, AuthContextType, UserRole } from './types';
import { mockUsers } from './mock-data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Failed to restore user from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error(res.status === 400 ? 'Invalid email or password' : 'Login failed');
      }

      const data = await res.json();
      setCurrentUser(data.user as User);
      localStorage.setItem('currentUser', JSON.stringify(data.user as User));
      return data.user.role as UserRole;
    } catch (error) {
      console.log('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    const res = fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
    });
    console.log(res)
  }, []);

  const register = useCallback(async (data: UserProfile) => {
    setIsLoading(true);
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(response.status === 400 ? 'Registration failed: Invalid data' : 'Registration failed');
      }

      const newUser = await response.json();
      setCurrentUser(newUser);
    } catch (error) {
      console.log('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!currentUser) {
        throw new Error('No user logged in');
      }

      setCurrentUser({
        ...currentUser,
        profile: {
          ...currentUser.profile,
          ...data,
        } as UserProfile,
      });
    } catch (error) {
      console.log('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const getUserRole = useCallback((): UserRole | null => {
    return currentUser?.role || null;
  }, [currentUser]);

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    getUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
