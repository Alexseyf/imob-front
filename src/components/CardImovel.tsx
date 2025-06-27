import { ImovelItf } from "@/utils/ImovelItf";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "./ConfirmModal";
import Image from "next/image";

export function CardImovel({ data }: { data: ImovelItf }) {
  const { userType } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleRemoveImovel = async () => {
    setIsDeleting(true);
    closeConfirmModal();
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Você precisa estar autenticado para remover um imóvel');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/imoveis/${data.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao remover imóvel');
      }

      toast.success('Imóvel removido com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao remover imóvel:', error);
      toast.error('Não foi possível remover o imóvel. Tente novamente mais tarde.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!userType || userType === "CLIENTE") {
    return (
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-80">
        <div className="relative">
          <a>
            <Image
              className="rounded-t-lg w-full h-48 object-cover"
              src={data.foto || "/placeholder.svg"}
              alt=""
              width={400}
              height={192}
            />
          </a>
          <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold py-1 px-2 rounded">
            <a>
              R$:{" "}
              {Number(data?.valor).toLocaleString("pt-br", {
                minimumFractionDigits: 2,
              })}
            </a>
          </div>
        </div>
        <div className="p-5 relative min-h-[180px]">
          <a>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {data.endereco}
            </h5>
          </a>
          <span className="mb-3 font-normal text-gray-700 dark:text-gray-400"></span>
          <div className="w-full">
            <Link href={`/detalhes/${data.id}`}>
              <Button variant="outline" className="w-full" size="lg">
                Detalhes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mb-4 ${userType === "SUPORTE" ? "h-[32,rem]" : "h-[26rem]"}`}> 
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-1/4 relative h-48 md:h-full">
          <Image
            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
            src={data.foto || "/placeholder.svg"}
            alt="Imagem do imóvel"
            width={400}
            height={192}
          />
          <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold py-1 px-2 rounded">
            R$:{" "}
            {Number(data?.valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="md:w-3/4 p-4 flex flex-col justify-between h-full overflow-hidden">
          <div className="flex-grow overflow-hidden">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-1 truncate">
              {data.endereco}
            </h5>
            <p className="font-bold text-gray-700 mb-1 truncate">
              {data.bairro.charAt(0).toUpperCase() + data.bairro.slice(1)}
            </p>

            {userType === "SUPORTE" ? (
              <div className="flex flex-col space-y-0.5 my-2 overflow-y-auto max-h-[14rem]">
                {data.quarto > 0 && (
                  <div className="text-xs text-gray-700">
                    {(data.quarto > 1 ? "Quartos: " : "Quarto: ") + data.quarto}
                  </div>
                )}
                {data.banheiro > 0 && (
                  <div className="text-xs text-gray-700">
                    {(data.banheiro > 1 ? "Banheiros: " : "Banheiro: ") + data.banheiro}
                  </div>
                )}
                {data.garagem > 0 && (
                  <div className="text-xs text-gray-700">
                    {(data.garagem > 1 ? "Garagens: " : "Garagem: ") + data.garagem}
                  </div>
                )}
                {data.area > 0 && (
                  <div className="text-xs text-gray-700">
                    {"Área: " + data.area + " m²"}
                  </div>
                )}
                {data.cozinha > 0 && (
                  <div className="text-xs text-gray-700">
                    {(data.cozinha > 1 ? "Cozinhas: " : "Cozinha: ") + data.cozinha}
                  </div>
                )}
                {data.sala > 0 && (
                  <div className="text-xs text-gray-700">
                    {(data.sala > 1 ? "Salas: " : "Sala: ") + data.sala}
                  </div>
                )}
                {data.suite > 0 && (
                  <div className="text-xs text-gray-700">
                    {(data.suite > 1 ? "Suítes: " : "Suíte: ") + data.suite}
                  </div>
                )}
                {data.areaServico > 0 && (
                  <div className="text-xs text-gray-700">
                    {(data.areaServico > 1 ? "Áreas de serviço: " : "Área de serviço: ") + data.areaServico}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 my-2">
                {data.quarto > 0 && (
                  <div className="text-xs text-gray-700">
                    <span className="font-medium">{data.quarto}</span> {data.quarto > 1 ? "Quartos" : "Quarto"}
                  </div>
                )}
                {data.banheiro > 0 && (
                  <div className="text-xs text-gray-700">
                    <span className="font-medium">{data.banheiro}</span> {data.banheiro > 1 ? "Banheiros" : "Banheiro"}
                  </div>
                )}
                {data.garagem > 0 && (
                  <div className="text-xs text-gray-700">
                    <span className="font-medium">{data.garagem}</span> {data.garagem > 1 ? "Garagens" : "Garagem"}
                  </div>
                )}
                {data.area > 0 && (
                  <div className="text-xs text-gray-700">
                    <span className="font-medium">{data.area}</span> m²
                  </div>
                )}
                {data.cozinha > 0 && (
                  <div className="text-xs text-gray-700">
                    <span className="font-medium">{data.cozinha}</span> {data.cozinha > 1 ? "Cozinhas" : "Cozinha"}
                  </div>
                )}
                {data.sala > 0 && (
                  <div className="text-xs text-gray-700">
                    <span className="font-medium">{data.sala}</span> {data.sala > 1 ? "Salas" : "Sala"}
                  </div>
                )}
                {data.suite > 0 && (
                  <div className="text-xs text-gray-700">
                    <span className="font-medium">{data.suite}</span> {data.suite > 1 ? "Suítes" : "Suíte"}
                  </div>
                )}
                {data.areaServico > 0 && (
                  <div className="text-xs text-gray-700">
                    <span className="font-medium">{data.areaServico}</span> {data.areaServico > 1 ? "Áreas de serviço" : "Área de serviço"}
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-gray-600">
              Tipo: {data.tipoImovel || "Não especificado"}
            </p>
          </div>

          <div className="mt-auto">
            {userType === "SUPORTE" ? (
              <Button 
                variant="destructive" 
                className="w-full md:w-auto" 
                size="lg"
                onClick={openConfirmModal}
                disabled={isDeleting}
              >
                {isDeleting ? 'Removendo...' : 'Remover Imóvel'}
              </Button>
            ) : (
              <Link href={`/detalhes/${data.id}`}>
                <Button variant="outline" className="w-full md:w-auto" size="lg">
                  Ver Detalhes
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <ConfirmModal 
        isOpen={showConfirmModal} 
        onClose={closeConfirmModal} 
        onConfirm={handleRemoveImovel}
        title="Confirmar remoção"
        message={`Tem certeza que deseja remover o imóvel "${data.endereco}"? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </div>
  );
}
