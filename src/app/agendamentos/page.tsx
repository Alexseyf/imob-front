'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Cliente {
  id: number;
  nome: string;
  email: string;
}

interface Imovel {
  id: number;
  endereco: string;
  bairro: string;
  foto: string;
  valor: number;
}

interface Admin {
  id: number;
  nome: string;
  email: string;
}

interface Agendamento {
  id: number;
  data: string;
  confirmado: boolean;
  imovelId: number;
  clienteId: number;
  adminId: number;
  createdAt: string;
  updatedAt: string;
  imovel: Imovel;
  cliente: Cliente;
  admin?: Admin;
}

export default function Agendamentos() {
  const router = useRouter();
  const { isAuthenticated, checkAuth, isAdmin } = useAuthStore();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [todosAgendamentos, setTodosAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTodosAgendamentos, setLoadingTodosAgendamentos] = useState(true);
  const [confirmingAgendamento, setConfirmingAgendamento] = useState<number | null>(null);

  useEffect(() => {
    checkAuth();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!isAdmin()) {
      router.push('/');
      return;
    }
    
    fetchAgendamentos();
    fetchTodosAgendamentos();
  }, [isAuthenticated, isAdmin, checkAuth, router]);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar os agendamentos');
      }

      const data = await response.json();
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast.error('Erro ao carregar os dados dos agendamentos');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTodosAgendamentos = async () => {
    try {
      setLoadingTodosAgendamentos(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos/todos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar todos os agendamentos');
      }

      const data = await response.json();
      setTodosAgendamentos(data);
    } catch (error) {
      console.error('Erro ao buscar todos os agendamentos:', error);
      toast.error('Erro ao carregar todos os agendamentos');
    } finally {
      setLoadingTodosAgendamentos(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const confirmarAgendamento = async (agendamentoId: number) => {
    if (confirmingAgendamento === agendamentoId) return;
    
    try {
      setConfirmingAgendamento(agendamentoId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos/confirmar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          agendamentoId: agendamentoId
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao confirmar agendamento');
      }
      
      setAgendamentos(agendamentos.map(agendamento => 
        agendamento.id === agendamentoId 
          ? { ...agendamento, confirmado: true }
          : agendamento
      ));
      
      toast.success('Agendamento confirmado com sucesso! Email enviado ao cliente.');
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao confirmar agendamento');
    } finally {
      setConfirmingAgendamento(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Meus Agendamentos</h2>
              <div className="flex space-x-4">
                <Button 
                  onClick={() => fetchAgendamentos()}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  size="sm"
                >
                  Atualizar Lista
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="bg-orange-50 hover:bg-orange-100"
                >
                  Voltar para Dashboard
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <p>Carregando dados dos agendamentos...</p>
            </div>
          ) : agendamentos.length === 0 ? (
            <div className="p-6 text-center">
              <p>Nenhum agendamento encontrado.</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="bg-yellow-50 p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-yellow-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Agendamentos pendentes
                </h3>
              </div>
              {agendamentos.filter(a => !a.confirmado).length === 0 ? (
                <div className="p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="mt-2 text-gray-500">Não há agendamentos pendentes no momento</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data/Hora
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Imóvel
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {agendamentos.filter(a => !a.confirmado).map((agendamento) => (
                        <tr key={agendamento.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatDate(agendamento.data)}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <span className="inline-block h-2 w-2 rounded-full bg-yellow-400 mr-1"></span>
                              Solicitado em {new Date(agendamento.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {agendamento.imovel.foto && (
                                <div className="flex-shrink-0 h-10 w-10 mr-4">
                                  <img className="h-10 w-10 rounded-md object-cover" src={agendamento.imovel.foto} alt="" />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {agendamento.imovel.endereco}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {agendamento.imovel.bairro} - {formatCurrency(agendamento.imovel.valor)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{agendamento.cliente.nome}</div>
                            <div className="text-sm text-gray-500">{agendamento.cliente.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Pendente
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button
                              onClick={() => confirmarAgendamento(agendamento.id)}
                              disabled={confirmingAgendamento === agendamento.id}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
                              size="sm"
                            >
                              {confirmingAgendamento === agendamento.id ? 'Confirmando...' : 'Confirmar Visita'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="bg-green-50 p-4 border-b border-gray-200 mt-8 border-t">
                <h3 className="text-lg font-semibold text-green-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Agendamentos confirmados
                </h3>
              </div>
              {agendamentos.filter(a => a.confirmado).length === 0 ? (
                <div className="p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-gray-500">Nenhum agendamento foi confirmado até o momento</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data/Hora
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Imóvel
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {agendamentos.filter(a => a.confirmado).map((agendamento) => (
                        <tr key={agendamento.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatDate(agendamento.data)}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                              Confirmado para visita
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {agendamento.imovel.foto && (
                                <div className="flex-shrink-0 h-10 w-10 mr-4">
                                  <img className="h-10 w-10 rounded-md object-cover" src={agendamento.imovel.foto} alt="" />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {agendamento.imovel.endereco}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {agendamento.imovel.bairro} - {formatCurrency(agendamento.imovel.valor)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{agendamento.cliente.nome}</div>
                            <div className="text-sm text-gray-500">{agendamento.cliente.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Confirmado
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button
                              disabled={true}
                              className="bg-gray-200 text-gray-500 text-xs py-1 px-2 rounded cursor-not-allowed opacity-50"
                              size="sm"
                            >
                              Confirmado
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mt-8">

          {loadingTodosAgendamentos ? (
            <div className="p-6 text-center">
              <p>Carregando todos os agendamentos...</p>
            </div>
          ) : todosAgendamentos.length === 0 ? (
            <div className="p-6 text-center">
              <p>Nenhum agendamento encontrado no sistema.</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="bg-blue-50 p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Lista Completa de Agendamentos
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data/Hora
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Imóvel
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responsável
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {todosAgendamentos.map((agendamento) => (
                      <tr key={agendamento.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(agendamento.data)}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-gray-400 mr-1"></span>
                            Solicitado em {new Date(agendamento.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {agendamento.imovel.foto && (
                              <div className="flex-shrink-0 h-10 w-10 mr-4">
                                <img className="h-10 w-10 rounded-md object-cover" src={agendamento.imovel.foto} alt="" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {agendamento.imovel.endereco}
                              </div>
                              <div className="text-sm text-gray-500">
                                {agendamento.imovel.bairro} - {formatCurrency(agendamento.imovel.valor)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{agendamento.cliente.nome}</div>
                          <div className="text-sm text-gray-500">{agendamento.cliente.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {agendamento.admin ? agendamento.admin.nome : 'Não atribuído'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {agendamento.admin ? agendamento.admin.email : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {agendamento.confirmado ? (
                            <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Confirmado
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Pendente
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
