"use client";

import { User, UserRole } from "@/lib/types";
import { DEMO_USER, users } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, useCallback } from "react";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "fundconnect_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuthSuccess = useCallback((authedUser: User) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authedUser));
    setUser(authedUser);
    router.push(`/${authedUser.role}/dashboard`);
    return authedUser;
  }, [router]);

  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // In a real app, you'd validate the password against a hash
    const foundUser = users.find((u) => u.email === email);
    
    if (foundUser) {
      handleAuthSuccess(foundUser);
      setLoading(false);
      return foundUser;
    }

    setLoading(false);
    return null;
  };
  
  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<User | null> => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        setLoading(false);
        return null;
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        avatarUrl: `https://picsum.photos/seed/${name}/100/100`
    };
    users.push(newUser); // In a real app, this would be a DB operation
    
    handleAuthSuccess(newUser);
    setLoading(false);
    return newUser;
  };


  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signup, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
