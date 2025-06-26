"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useImoveisStore } from "@/store/useImoveisStore";
import { useEffect, useRef, useState } from "react";

export function StoreInitializer() {
  const checkAuth = useAuthStore(state => state.checkAuth);
  const fetchImoveis = useImoveisStore(state => state.fetchImoveis);
  const [isMounted, setIsMounted] = useState(false);

  const checkAuthRef = useRef(checkAuth);
  const fetchImoveisRef = useRef(fetchImoveis);
  
  useEffect(() => {
    checkAuthRef.current = checkAuth;
    fetchImoveisRef.current = fetchImoveis;
  }, [checkAuth, fetchImoveis]);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    checkAuthRef.current();
    fetchImoveisRef.current();

    const handleFocus = () => {
      checkAuthRef.current();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isMounted]);

  return null;
}
