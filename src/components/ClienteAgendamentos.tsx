"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

export function ClienteAgendamentos() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [clienteAgendamentos, setClienteAgendamentos] = useState<Agendamento[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchClienteAgendamentos();
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const fetchClienteAgendamentos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agendamentos/meus`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar os seus agendamentos");
      }

      const data = await response.json();
      setClienteAgendamentos(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos do cliente:", error);

      if (localStorage.getItem("token")) {
        toast.error("Erro ao carregar os seus agendamentos");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR")
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Minhas Visitas
            </h2>
            <Button
              onClick={fetchClienteAgendamentos}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              size="sm"
            >
              Atualizar Lista
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <p>Carregando seus agendamentos...</p>
          </div>
        ) : clienteAgendamentos.length === 0 ? (
          <div className="p-6 text-center flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg text-gray-600 mb-2">
              Você ainda não tem visitas agendadas
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Visite nossa página inicial e agende visitas nos imóveis que você
              tem interesse.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Ver Imóveis Disponíveis
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Data/Hora
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Imóvel
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Corretor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clienteAgendamentos.map((agendamento) => (
                    <tr key={agendamento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(agendamento.data)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <span className="inline-block h-2 w-2 rounded-full bg-gray-400 mr-1"></span>
                          Solicitado em{" "}
                          {new Date(agendamento.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {agendamento.imovel.foto && (
                            <div className="flex-shrink-0 h-10 w-10 mr-4">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={agendamento.imovel.foto}
                                alt=""
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {agendamento.imovel.endereco}
                            </div>
                            <div className="text-sm text-gray-500">
                              {agendamento.imovel.bairro} -{" "}
                              {formatCurrency(agendamento.imovel.valor)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {agendamento.confirmado ? (
                          <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <svg
                              className="h-3 w-3 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Confirmado
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <svg
                              className="h-3 w-3 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Aguardando confirmação
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {agendamento.admin ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {agendamento.admin.nome}
                            </div>
                            <div className="text-sm text-gray-500">
                              {agendamento.admin.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Aguardando atribuição
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Informações Importantes:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    As visitas confirmadas serão acompanhadas por um corretor.
                  </li>
                  <li>
                    Em caso de necessidade de cancelamento, entre em contato
                    conosco com pelo menos 24h de antecedência.
                  </li>
                  <li>
                    Para qualquer dúvida, entre em contato pelo telefone (XX)
                    XXXX-XXXX.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
