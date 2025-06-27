'use client'

import { ImovelItf } from "@/utils/ImovelItf";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import AgendarVisitaModal from "@/components/AgendarVisitaModal";
import Image from "next/image";

export default function DetalhesImovel() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, checkAuth, userType } = useAuthStore();
  const [showAgendarModal, setShowAgendarModal] = useState(false);
  
  const checkAuthRef = useRef(checkAuth);

  useEffect(() => {
    checkAuthRef.current = checkAuth;
  }, [checkAuth]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    checkAuthRef.current();
  }, []);
  
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
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-4 sm:p-6">
        {imovel ? (
          <div className="flex flex-col md:flex-row gap-4 md:gap-0">
            <div className="w-full md:w-7/12 flex-shrink-0">
              <Image
                className="rounded-lg w-full h-56 sm:h-80 md:h-96 object-cover mb-4 md:mb-0"
                src={imovel.foto || "/placeholder.svg"}
                alt="imagem do imóvel"
                width={800}
                height={400}
                priority
              />
            </div>
            <div className="w-full md:w-5/12 md:pl-6 flex flex-col relative">
              <h2 className="text-lg sm:text-xl font-semibold mb-1 break-words">{imovel.endereco}</h2>
              <p className="text-gray-700 mb-2 font-bold">
                {imovel.bairro.charAt(0).toUpperCase() + imovel.bairro.slice(1)}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {imovel.quarto !== 0 && (
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">{imovel.quarto} {imovel.quarto > 1 ? "Quartos" : "Quarto"}</span>
                )}
                {imovel.banheiro !== 0 && (
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">{imovel.banheiro} {imovel.banheiro > 1 ? "Banheiros" : "Banheiro"}</span>
                )}
                {imovel.garagem !== 0 && (
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">{imovel.garagem} {imovel.garagem > 1 ? "Garagens" : "Garagem"}</span>
                )}
                {imovel.cozinha !== 0 && (
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">{imovel.cozinha} {imovel.cozinha > 1 ? "Cozinhas" : "Cozinha"}</span>
                )}
                {imovel.sala !== 0 && (
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">{imovel.sala} {imovel.sala > 1 ? "Salas" : "Sala"}</span>
                )}
                {imovel.suite !== 0 && (
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">{imovel.suite} {imovel.suite > 1 ? "Suites" : "Suite"}</span>
                )}
                {imovel.areaServico !== 0 && (
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">{imovel.areaServico} {imovel.areaServico > 1 ? "Áreas de serviço" : "Área de serviço"}</span>
                )}
                {imovel.area !== 0 && (
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">Área total: {imovel.area} m²</span>
                )}
              </div>
              <div className="mt-2 mb-4">
                <span className="text-lg sm:text-xl font-bold text-green-700">Valor: R$ {Number(imovel.valor).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>Nenhum dado encontrado</p>
        )}
        <div className="mt-4 flex flex-col md:flex-row gap-2 md:gap-4">
          {isAuthenticated ? (
            userType === 'ADMIN' ? (
              <Button 
                variant="outline" 
                className="w-full md:w-1/2 bg-red-100" 
                size="lg"
                onClick={handleDelete}
              >
                Excluir imóvel
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full md:w-1/2 bg-green-100" 
                size="lg"
                onClick={() => setShowAgendarModal(true)}
              >
                Agendar uma visita
              </Button>
            )) : (
            <Button 
              variant="outline" 
              className="w-full md:w-1/2 bg-green-100" 
              size="lg"
              onClick={() => {
                localStorage.setItem('redirectAfterLogin', `/detalhes/${params.imovel_id}`);
                router.push('/login');
              }}
            >
              Faça login para agendar um visita
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full md:w-1/2 bg-red-50"
            size="lg"
            onClick={() => window.history.back()}
          >
            Voltar
          </Button>
        </div>
      </div>
      
      {imovel && (
        <AgendarVisitaModal 
          isOpen={showAgendarModal} 
          onClose={() => setShowAgendarModal(false)} 
          imovelId={imovel.id} 
        />
      )}
    </div>
  );
}
