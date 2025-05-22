"use client";

import { create } from 'zustand';
import { ImovelItf } from "@/utils/ImovelItf";

interface ImoveisStore {
  imoveis: ImovelItf[];
  loading: boolean;
  error: string | null;
  currentSearchTerm: string | null;
  fetchImoveis: () => Promise<void>;
  fetchImovelPorTermo: (termo: string) => Promise<ImovelItf[]>;
  setImoveis: (imoveis: ImovelItf[]) => void;
  resetImoveis: () => Promise<void>;
}

export const useImoveisStore = create<ImoveisStore>((set) => ({
  imoveis: [],
  loading: false,
  error: null,
  currentSearchTerm: null,

  fetchImoveis: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/imoveis`);
      const data = await response.json();
      set({ imoveis: data, loading: false });
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      set({ error: 'Falha ao carregar imóveis', loading: false });
    }
  },

  setImoveis: (imoveis) => set({ imoveis }),

  fetchImovelPorTermo: async (termo) => {
    set({ loading: true, currentSearchTerm: termo });
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/imoveis/pesquisa/${termo}`;
      const response = await fetch(url);
      const data = await response.json();
      set({ imoveis: data, loading: false });
      return data;
    } catch (error) {
      console.error('Erro ao buscar imóveis por termo:', error);
      set({ error: 'Falha ao buscar imóveis', loading: false });
      return [];
    }
  },

  resetImoveis: async () => {
    set({ loading: true, currentSearchTerm: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/imoveis`);
      const data = await response.json();
      set({ imoveis: data, loading: false });
    } catch (error) {
      console.error('Erro ao resetar imóveis:', error);
      set({ error: 'Falha ao resetar imóveis', loading: false });
    }
  },
}));
