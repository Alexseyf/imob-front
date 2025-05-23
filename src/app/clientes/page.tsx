'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Interface para os dados do cliente
interface Imovel {
  id: number;
  endereco: string;
  bairro: string;
}

interface Agendamento {
  id: number;
  data: string;
  confirmado: boolean;
  imovel: Imovel;
  adminId: number; // ID do admin responsável pelo agendamento
}

interface Cliente {
  id: number;
  nome: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isArquivado: boolean;
  tipoUsuario: string;
  clienteAgendamentos: Agendamento[];
}

export default function Clientes() {
  const router = useRouter();
  const { isAuthenticated, checkAuth, isAdmin } = useAuthStore();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCliente, setExpandedCliente] = useState<number | null>(null);
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
    
    fetchClientes();
  }, [isAuthenticated, isAdmin, checkAuth, router]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/clientes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar os clientes');
      }

      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar os dados dos clientes');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };

  const toggleExpanded = (clienteId: number) => {
    if (expandedCliente === clienteId) {
      setExpandedCliente(null);
    } else {
      setExpandedCliente(clienteId);
    }
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
      
      // Atualizar o estado dos clientes com o agendamento confirmado
      setClientes(clientes.map(cliente => {
        return {
          ...cliente,
          clienteAgendamentos: cliente.clienteAgendamentos.map(agendamento => 
            agendamento.id === agendamentoId 
              ? { ...agendamento, confirmado: true }
              : agendamento
          )
        };
      }));
      
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
              <h2 className="text-2xl font-semibold text-gray-800">Clientes Cadastrados</h2>
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="bg-orange-50 hover:bg-orange-100"
              >
                Voltar para Dashboard
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <p>Carregando dados dos clientes...</p>
            </div>
          ) : clientes.length === 0 ? (
            <div className="p-6 text-center">
              <p>Nenhum cliente encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agendamentos
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{cliente.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(cliente.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {cliente.clienteAgendamentos.length} agendamento(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => toggleExpanded(cliente.id)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          {expandedCliente === cliente.id ? 'Ocultar detalhes' : 'Ver detalhes'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Detalhes dos agendamentos */}
              {expandedCliente !== null && (
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Agendamentos do Cliente: {clientes.find(c => c.id === expandedCliente)?.nome}
                  </h3>
                  
                  {clientes.find(c => c.id === expandedCliente)?.clienteAgendamentos.length === 0 ? (
                    <p className="text-gray-500">Este cliente não possui agendamentos.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data/Hora
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Endereço
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Bairro
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
                          {clientes.find(c => c.id === expandedCliente)?.clienteAgendamentos.map((agendamento) => (
                            <tr key={agendamento.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{agendamento.id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{formatDate(agendamento.data)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{agendamento.imovel.endereco}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{agendamento.imovel.bairro}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${agendamento.confirmado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {agendamento.confirmado ? 'Confirmado' : 'Pendente'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {!agendamento.confirmado && (
                                  <Button
                                    onClick={() => confirmarAgendamento(agendamento.id)}
                                    disabled={confirmingAgendamento === agendamento.id}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
                                    size="sm"
                                  >
                                    {confirmingAgendamento === agendamento.id ? 'Confirmando...' : 'Confirmar Visita'}
                                  </Button>
                                )}
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
          )}
        </div>
      </div>
    </div>
  );
}
