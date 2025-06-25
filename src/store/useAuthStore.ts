"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserType = 'ADMIN' | 'CLIENTE' | 'SUPORTE' | '';

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
  isSuporte: () => boolean;
}

const normalizeUserType = (type: string): UserType => {
  if (!type) return '';
  
  const normalized = type.trim().toUpperCase();
  if (normalized === 'ADMIN') return 'ADMIN';
  if (normalized === 'CLIENTE') return 'CLIENTE';
  if (normalized === 'SUPORTE') return 'SUPORTE';
  
  return 'CLIENTE';
};

function checkIsAdmin(userType: UserType): boolean {
  return userType === 'ADMIN';
}

function checkIsSuporte(userType: UserType): boolean {
  return userType === 'SUPORTE';
}

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
        return checkIsAdmin(get().userType);
      },
      
      isSuporte: () => {
        return checkIsSuporte(get().userType);
      },
      
      checkAuth: () => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          const userName = localStorage.getItem('userName') || '';
          const userEmail = localStorage.getItem('email') || '';
          const userType = localStorage.getItem('userType') || '';
          
          const isCurrentlyAuthenticated = !!token;
          const currentUserType = normalizeUserType(userType);

          const currentState = get();
          if (
            currentState.isAuthenticated !== isCurrentlyAuthenticated ||
            currentState.userName !== userName ||
            currentState.userEmail !== userEmail ||
            currentState.userType !== currentUserType
          ) {
            set({ 
              isAuthenticated: isCurrentlyAuthenticated,
              userName,
              userEmail,
              userType: currentUserType
            });
          }
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
