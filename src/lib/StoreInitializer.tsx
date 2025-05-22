"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useImoveisStore } from "@/store/useImoveisStore";
import { useEffect } from "react";

export function StoreInitializer() {
  const checkAuth = useAuthStore(state => state.checkAuth);
  const fetchImoveis = useImoveisStore(state => state.fetchImoveis);

  useEffect(() => {
    checkAuth();
    fetchImoveis();

    const handleFocus = () => {
      checkAuth();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAuth, fetchImoveis]);

  return null;
}
