'use client'

import React, { useEffect, useState } from 'react'
import {
  VictoryPie,
  VictoryLabel,
  VictoryTheme,
  VictoryLegend
} from "victory";
import { useAuthStore } from '@/store/useAuthStore';

interface AdminAgendamentos {
  id: string;
  nome: string;
  agendamentos: {
    confirmados: number;
    naoConfirmados: number;
    total: number;
  };
}

const PieChart = () => {
  const [adminData, setAdminData] = useState<AdminAgendamentos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAgendamentos | null>(null);
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
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suporte/admins-agendamentos`, {
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
          throw new Error('Falha ao buscar dados de agendamentos por admin');
        }
        
        const data = await response.json();
        setAdminData(data);

        if (data && data.length > 0) {
          setSelectedAdmin(data[0]);
        }
      } catch {
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

  if (adminData.length === 0 || !selectedAdmin) {
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

  const pieData = [
    { x: "Confirmados", y: selectedAdmin.agendamentos.confirmados },
    { x: "Não Confirmados", y: selectedAdmin.agendamentos.naoConfirmados },
  ];

  const colorScale = ["#4CAF50", "#FF5252"];

  const AdminSelector = () => (
    <div className="mb-4 max-w-xs mx-auto relative z-10">
      <label htmlFor="admin-select" className="block text-sm font-medium text-gray-700 mb-1">
        Selecionar Corretor:
      </label>
      <select
        id="admin-select"
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 appearance-auto"
        value={selectedAdmin.id}
        onChange={(e) => {
          const selected = adminData.find(admin => admin.id === e.target.value);
          if (selected) setSelectedAdmin(selected);
        }}
      >
        {adminData.map(admin => (
          <option key={admin.id} value={admin.id}>
            {admin.nome}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="h-[420px] overflow-visible">
      <AdminSelector />
      
      <div className="relative h-[calc(100%-80px)]">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <VictoryPie
            standalone={false}
            width={400}
            height={400}
            data={pieData}
            innerRadius={68}
            labelRadius={90}
            theme={VictoryTheme.material}
            colorScale={colorScale}
            style={{
              data: {
                fillOpacity: 0.9,
                stroke: "white",
                strokeWidth: 2
              },
              labels: {
                fontSize: 0
              }
            }}
            animate={{
              duration: 1000
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{ fontSize: 18 }}
            x={200}
            y={200}
            text={(selectedAdmin.nome || "").split(" ").slice(0, 1).join(" ") + "\n" + (selectedAdmin.nome || "").split(" ").slice(1).join(" ")}
          />
        </svg>
      </div>
      
      <div>
        <VictoryLegend
          x={0}
          y={0}
          centerTitle
          orientation="horizontal"
          gutter={20}
          itemsPerRow={3}
          style={{
            title: { fontSize: 14 },
            labels: { fontSize: 5 }
          }}
          data={[
            { name: `Confirmados: ${selectedAdmin.agendamentos.confirmados}`, symbol: { fill: colorScale[0] } },
            { name: `Não Confirmados: ${selectedAdmin.agendamentos.naoConfirmados}`, symbol: { fill: colorScale[1] } }
          ]}
        />
      </div>
    </div>
  );
};

export default PieChart;