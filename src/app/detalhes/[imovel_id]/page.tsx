'use client'

import { ImovelItf } from "@/utils/ImovelItf";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export default function DetalhesImovel() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, checkAuth, userType } = useAuthStore();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    checkAuth();
  }, [checkAuth]);
  
  const [imovel, setImovel] = useState<ImovelItf>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscaDados() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/imoveis/${params.imovel_id}`
        );
        const data = await response.json();
        console.log(data);
        setImovel(data);
      } finally {
        setLoading(false);
      }
    }
    buscaDados();
  }, [params.imovel_id]);
  const handleDelete = async () => {
    if (!imovel || !imovel.id) return;

    if (userType !== 'ADMIN') {
      toast.error("Apenas administradores podem excluir imóveis");
      return;
    }
    
    if (!confirm("Tem certeza que deseja excluir este imóvel?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/imoveis/${imovel.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        toast.success("Imóvel excluído com sucesso!");
        router.push('/');
      } else {
        toast.error("Erro ao excluir o imóvel");
      }
    } catch (error) {
      console.error("Erro ao excluir o imóvel:", error);
      toast.error("Erro ao excluir o imóvel");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-2 bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
        {imovel ? (
          <div className="flex flex-col md:flex-row">
            <div className="md:w:10/12">
              <img
                className="rounded-lg w-full h-120 object-cover mb-4 md:mb-0"
                src={imovel.foto || "/placeholder.svg"}
                alt="imagem do imóvel"
              />
            </div>
            <div className="md:w-5/12 md:pl-6 relative">
              <h2 className="text-xl font-semibold">{imovel.endereco}</h2>
              <p className="text-gray-700 mb-2 font-bold">
                {imovel.bairro.charAt(0).toUpperCase() + imovel.bairro.slice(1)}
              </p>
              {imovel.quarto !== 0 && (
                <p className="text-gray-700 mb-2">
                  {imovel.quarto} {imovel.quarto > 1 ? "Quartos" : "Quarto"}
                </p>
              )}
              {imovel.banheiro !== 0 && (
                <p className="text-gray-700 mb-2">
                  {imovel.banheiro}{" "}
                  {imovel.banheiro > 1 ? "Banheiros" : "Banheiro"}
                </p>
              )}
              {imovel.garagem !== 0 && (
                <p className="text-gray-700 mb-2">
                  {imovel.garagem} {imovel.garagem > 1 ? "Garagens" : "Garagem"}
                </p>
              )}
              {imovel.cozinha !== 0 && (
                <p className="text-gray-700 mb-2">
                  {imovel.cozinha} {imovel.cozinha > 1 ? "Cozinhas" : "Cozinha"}
                </p>
              )}
              {imovel.sala !== 0 && (
                <p className="text-gray-700 mb-2">
                  {imovel.sala} {imovel.sala > 1 ? "Salas" : "Sala"}
                </p>
              )}
              {imovel.suite !== 0 && (
                <p className="text-gray-700 mb-2">
                  {imovel.suite} {imovel.suite > 1 ? "Suites" : "Suite"}
                </p>
              )}
              {imovel.areaServico !== 0 && (
                <p className="text-gray-700 mb-2">
                  {imovel.areaServico}{" "}
                  {imovel.areaServico > 1
                    ? "Áreas de serviço"
                    : "Área de serviço"}
                </p>
              )}
              {imovel.area !== 0 && (
                <p className="text-gray-700 mb-2">
                  Área total: {imovel.area} m²
                </p>
              )}
              <p className="text-gray-700 font-bold absolute bottom-0 right-0 p-2">
                Valor: R${" "}
                {Number(imovel.valor).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        ) : (
          <p>Nenhum dado encontrado</p>
        )}        <div className="mt-4 flex space-x-4">
          {isAuthenticated ? (
            userType === 'ADMIN' ? (
              <Button 
                variant="outline" 
                className="w-1/2 bg-red-100" 
                size="lg"
                onClick={handleDelete}
              >
                Excluir imóvel
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-1/2 bg-green-100" 
                size="lg"
                onClick={() => toast.info("Funcionalidade de agendamento em desenvolvimento")}
              >
                Agendar uma visita
              </Button>
            )          ) : (
            <Button 
              variant="outline" 
              className="w-1/2 bg-green-100" 
              size="lg"
              onClick={() => {
                localStorage.setItem('redirectAfterLogin', `/detalhes/${params.imovel_id}`);
                router.push('/login');
              }}
            >
              Faça login para agendar
            </Button>          )}
          <Button
            variant="outline"
            className="w-1/2 bg-red-50"
            size="lg"
            onClick={() => window.history.back()}
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
