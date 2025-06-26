"use client";
import { CardImovel } from "@/components/CardImovel";
import CarouselTop5 from "@/components/carousel-top5";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useImoveisStore } from "@/store/useImoveisStore";

export default function Home() {
  const { isAuthenticated, userType } = useAuthStore();
  const { imoveis, resetImoveis, currentSearchTerm } = useImoveisStore();

  useEffect(() => {
    resetImoveis();
  }, [resetImoveis]);

  const listaImoveis = imoveis.map((imovel) => (
    <CardImovel data={imovel} key={imovel.id} />
  ));

  const showCarousel = !currentSearchTerm && !isAuthenticated;

  return (
    <>
      <div>
        {showCarousel && (
          <>
            <CarouselTop5 />
          </>
        )}
        
        <div className={`grid ${
          userType === 'ADMIN' 
            ? 'grid-cols-1' 
            : userType === 'SUPORTE'
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          } gap-4 p-4 w-4/5 mx-auto`}
        >
          {listaImoveis}
        </div>
      </div>
    </>
  );
}
