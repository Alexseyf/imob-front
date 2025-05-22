import { ImovelItf } from "@/utils/ImovelItf";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

export function CardImovel({ data }: { data: ImovelItf }) {
  const { userType } = useAuthStore();

  if (!userType || userType === "CLIENTE") {
    return (
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="relative">
          <a>
            <img
              className="rounded-t-lg w-full h-48 object-cover"
              src={data.foto || "/placeholder.svg"}
              alt=""
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
          <div className="absolute bottom-5 left-5 right-5">
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
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mb-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 relative">
          <img
            className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
            src={data.foto || "/placeholder.svg"}
            alt="Imagem do imóvel"
          />
          <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold py-1 px-2 rounded">
            R$:{" "}
            {Number(data?.valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="md:w-3/4 p-5 flex flex-col justify-between">
          <div>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              {data.endereco}
            </h5>
            <p className="font-bold text-gray-700 mb-2">
              {data.bairro.charAt(0).toUpperCase() + data.bairro.slice(1)}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 my-3">
              {data.quarto > 0 && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{data.quarto}</span>{" "}
                  {data.quarto > 1 ? "Quartos" : "Quarto"}
                </div>
              )}
              {data.banheiro > 0 && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{data.banheiro}</span>{" "}
                  {data.banheiro > 1 ? "Banheiros" : "Banheiro"}
                </div>
              )}
              {data.garagem > 0 && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{data.garagem}</span>{" "}
                  {data.garagem > 1 ? "Garagens" : "Garagem"}
                </div>
              )}
              {data.area > 0 && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{data.area}</span> m²
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600">
              Tipo: {data.tipoImovel || "Não especificado"}
            </p>
          </div>

          <div className="mt-4">
            <Link href={`/detalhes/${data.id}`}>
              <Button variant="outline" className="w-full md:w-auto" size="lg">
                Ver Detalhes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
