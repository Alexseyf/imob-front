"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserType = 'ADMIN' | 'CLIENTE' | '';

interface AuthStore {
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  userType: UserType;
  setIsAuthenticated: (value: boolean) => void;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setUserType: (type: string) => void;
  checkAuth: () => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const normalizeUserType = (type: string): UserType => {
  if (!type) return '';
  
  const normalized = type.trim().toUpperCase();
  if (normalized === 'ADMIN') return 'ADMIN';
  if (normalized === 'CLIENTE') return 'CLIENTE';
  
  return 'CLIENTE';
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userName: '',
      userEmail: '',
      userType: '',
      
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setUserName: (name) => set({ userName: name }),
      setUserEmail: (email) => set({ userEmail: email }),
      setUserType: (type) => {
        const normalizedType = normalizeUserType(type);
        set({ userType: normalizedType });
      },
      
      isAdmin: () => {
        return get().userType === 'ADMIN';
      },
      
      checkAuth: () => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          const userName = localStorage.getItem('userName') || '';
          const userEmail = localStorage.getItem('email') || '';
          const userType = localStorage.getItem('userType') || '';

          set({ 
            isAuthenticated: !!token,
            userName,
            userEmail,
            userType: normalizeUserType(userType)
          });
        }
      },
      
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userType');
          localStorage.removeItem('email');
          set({ isAuthenticated: false, userName: '', userEmail: '', userType: '' });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
