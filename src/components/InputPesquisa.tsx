"use client";

import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useImoveisStore } from "@/store/useImoveisStore";

type Inputs = {
  termo: string;
};

export function InputPesquisa() {
  const { fetchImoveis, fetchImovelPorTermo } = useImoveisStore();
  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>();

  async function enviaPesquisa(data: Inputs) {
    if (data.termo.length < 2) {
      toast.error("Informe, no mínimo, 2 caracteres");
      setFocus("termo");
      reset({ termo: "" });
      return;
    }

    try {
      const resultado = await fetchImovelPorTermo(data.termo);
      if (!resultado || resultado.length === 0) {
        toast.error("Nenhum imóvel encontrado");
        await fetchImoveis();
        setFocus("termo");
        reset({ termo: "" });
        return;
      }
      setFocus("termo");
      reset({ termo: "" });
    } catch (_) {
      toast.error("Erro ao buscar imóveis. Tente novamente.");
    }
  }
  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit(enviaPesquisa)}>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Pesquisar
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500"
          placeholder="O que você procura?"
          {...register("termo", { required: true })}
        />
        <Button
          type="submit"
          className="text-white absolute end-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-3 py-1.5"
        >
          Buscar
        </Button>
      </div>
    </form>
  );
}
