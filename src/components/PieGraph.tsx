'use client'

import React, { useEffect, useState } from 'react'
import {
  VictoryPie,
  VictoryTheme,
  VictoryTooltip,
  VictoryContainer,
  VictoryLegend
} from "victory"; 
import { useAuthStore } from '@/store/useAuthStore';

interface ImoveisPorBairro {
  bairro: string;
  total_imoveis: number;
}

const PieGraph = () => {
  const [imoveisPorBairro, setImoveisPorBairro] = useState<ImoveisPorBairro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const isSuporte = useAuthStore(state => state.isSuporte);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
        
        if (!token) {
          setError('Você precisa estar autenticado para visualizar este gráfico');
          setLoading(false);
          return;
        }
        
        if (!isSuporte()) {
          setError('Você não tem permissão para acessar estes dados');
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suporte/imoveis-por-bairro`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-User-Type': userType || ''
          }
        });
        
        if (response.status === 401 || response.status === 403) {
          setError('Você não tem permissão para acessar estes dados');
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Falha ao buscar dados de imóveis por bairro');
        }
        
        const data = await response.json();
        setImoveisPorBairro(data);
      } catch (err) {
        setError('Não foi possível carregar os dados do gráfico');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSuporte, isMounted]);

  if (!isMounted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-64">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-64">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Carregando dados...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-64">
        <div className="text-red-500 text-center h-full flex items-center justify-center flex-col">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (imoveisPorBairro.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-64">
        <div className="text-gray-500 text-center h-full flex items-center justify-center flex-col">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Não há dados disponíveis para exibir</p>
        </div>
      </div>
    );
  }

  const chartData = imoveisPorBairro.map(item => ({
    x: item.bairro,
    y: Number(item.total_imoveis),
    label: `${item.bairro}: ${item.total_imoveis}`
  }));

  // cores bairros
  const colorScale = [
    "#FF5252", "#FF4081", "#E040FB", "#7C4DFF", 
    "#536DFE", "#448AFF", "#40C4FF", "#18FFFF", 
    "#64FFDA", "#69F0AE", "#B2FF59", "#EEFF41", 
    "#FFFF00", "#FFD740", "#FFAB40", "#FF6E40"
  ];

  // legendas
  const legendData = imoveisPorBairro.map((item, index) => ({
    name: `${item.bairro}: ${item.total_imoveis}`,
    symbol: { fill: colorScale[index % colorScale.length] }
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Distribuição de Imóveis por Bairro</h2>
      <div className="h-96">
        <VictoryPie
          data={chartData}
          theme={VictoryTheme.material}
          colorScale={colorScale}
          labelComponent={<VictoryTooltip />}
          style={{
            data: {
              fillOpacity: 0.9,
              stroke: "white",
              strokeWidth: 2
            },
            labels: {
              fontSize: 12,
              fill: "#333"
            }
          }}
          containerComponent={<VictoryContainer responsive={true} />}
          animate={{
            duration: 2000
          }}
        />
        <VictoryLegend
          x={0}
          y={0}
          centerTitle
          orientation="horizontal"
          gutter={20}
          style={{
            title: { fontSize: 14 },
            labels: { fontSize: 10 }
          }}
          data={legendData}
        />
      </div>
    </div>
  )
}

export default PieGraph
