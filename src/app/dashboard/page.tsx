"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import RegisterModal from "@/components/RegisterModal";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [modalAdminOpen, setModalAdminOpen] = useState(false);

  useEffect(() => {
    checkAuth();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, isAdmin, checkAuth, router]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleNotImplementedPage = (path: string) => {
    toast.error("Página não implementada em desenvolvimento");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => handleNavigation("/")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Imóveis</h2>
            <p className="text-gray-600 mt-2 text-center">
              Gerenciar imóveis cadastrados
            </p>
          </button>

          <button
            onClick={() => handleNavigation("/clientes")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Clientes</h2>
            <p className="text-gray-600 mt-2 text-center">
              Gerenciar clientes cadastrados
            </p>
          </button>

          <button
            onClick={() => handleNavigation("/agendamentos")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-orange-500"
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
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Agendamentos
            </h2>
            <p className="text-gray-600 mt-2 text-center">
              Gerenciar agendamentos de visitas
            </p>
          </button>

            <button
            onClick={() => handleNotImplementedPage("/agendamentos")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center"
            >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7m-9 8h4m-2-2v4M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"
              />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Cadastrar imóvel
            </h2>
            <p className="text-gray-600 mt-2 text-center">
              Gerenciar cadastro de imóveis
            </p>
            </button>            <button
            onClick={() => setModalAdminOpen(true)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center"
            >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 2v2m0 0h2m-2 0h-2"
              />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Cadastrar administrador
            </h2>
            <p className="text-gray-600 mt-2 text-center">
              Gerenciar cadastro de usuários
            </p>
            </button>        </div>
      </div>

      <RegisterModal 
        isOpen={modalAdminOpen} 
        onClose={() => setModalAdminOpen(false)} 
        tipoUsuario="ADMIN"
      />
    </div>
  );
}
