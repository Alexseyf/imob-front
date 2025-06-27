"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { InputPesquisa } from "@/components/InputPesquisa";
import { useImoveisStore } from "@/store/useImoveisStore";
import { useState, useEffect } from "react";

export function Header() {
  const router = useRouter();
  const { isAuthenticated, logout, userType } = useAuthStore();
  const { resetImoveis } = useImoveisStore();
  const [isMounted, setIsMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    resetImoveis();
    router.push("/");
  };
  return (
    <nav className="border-orange-200 bg-orange-50 dark:border-orange-700 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <button
          onClick={handleHomeClick}
          className="flex items-center justify-center space-x-3 rtl:space-x-reverse transition-transform duration-200 hover:scale-105"
        >
          <img src="/logo.png" className="h-10" alt="Logo Imob" />
          <span className="text-2xl font-semibold whitespace-nowrap text-orange-600">
            Imob
          </span>
        </button>
        <div className="flex md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-orange-600 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Abrir menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex-grow max-w-md mx-4">
          {isMounted && (!isAuthenticated || userType === "CLIENTE") && <InputPesquisa />}
        </div>
        <div className="hidden md:flex md:items-center md:w-auto">
          <div className="hidden w-full md:block md:w-auto">
            <ul className="flex flex-col items-center font-medium mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
              <li>
                <button
                  onClick={handleHomeClick}
                  className="inline-flex items-center justify-center h-9 px-4 md:px-3 text-gray-900 font-medium transition-colors duration-200 hover:text-orange-600 hover:bg-orange-50 md:hover:bg-transparent rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </button>
              </li>
              {isMounted && isAuthenticated && userType === "CLIENTE" && (
                <li>
                  <Link
                    href="/agendamentos"
                    className="inline-flex items-center justify-center h-9 px-4 md:px-3 text-gray-900 font-medium transition-colors duration-200 hover:text-orange-600 hover:bg-orange-50 md:hover:bg-transparent rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Agendamentos
                  </Link>
                </li>
              )}
              {isMounted ? (
                isAuthenticated ? (
                <>
                  {(userType === "ADMIN" || userType === "SUPORTE") && (
                    <li>
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center h-9 px-4 md:px-3 text-gray-900 font-medium transition-colors duration-200 hover:text-orange-600 hover:bg-orange-50 md:hover:bg-transparent rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                      </Link>
                    </li>
                  )}{" "}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center h-9 px-4 md:px-3 text-gray-900 font-medium transition-colors duration-200 hover:text-red-600 hover:bg-red-50 md:hover:bg-transparent rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 3a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L14 10.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Sair
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center h-9 px-4 md:px-3 text-gray-900 font-medium transition-colors duration-200 hover:text-orange-600 hover:bg-orange-50 md:hover:bg-transparent rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Login
                  </Link>
                </li>
              )) : null}{" "}
            </ul>
          </div>
        </div>
        {/* Mobile menu overlay */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMenuOpen(false)}>
            {/* Top dropdown menu */}
            <div
              className="absolute top-0 left-0 w-full bg-white shadow-lg p-6 z-50 flex flex-col gap-4 animate-slide-down"
              style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="self-end mb-2 text-2xl text-gray-500 hover:text-orange-600" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">✕</button>
              <button onClick={e => { handleHomeClick(e); setMenuOpen(false); }} className="flex items-center gap-2 text-lg font-medium text-orange-600 hover:text-orange-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                Home
              </button>
              {isMounted && isAuthenticated && userType === "CLIENTE" && (
                <Link href="/agendamentos" className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-orange-600" onClick={() => setMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                  Agendamentos
                </Link>
              )}
              {isMounted && isAuthenticated && (userType === "ADMIN" || userType === "SUPORTE") && (
                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-orange-600" onClick={() => setMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  Dashboard
                </Link>
              )}
              {isMounted && isAuthenticated ? (
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-2 text-lg font-medium text-red-600 hover:text-red-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 3a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L14 10.586V6z" clipRule="evenodd" /></svg>
                  Sair
                </button>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-lg font-medium text-orange-600 hover:text-orange-800" onClick={() => setMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  Login
                </Link>
              )}
            </div>
            <div className="fixed inset-0 bg-black/40" style={{top: 0, left: 0, right: 0, height: '100vh'}} aria-hidden="true"></div>
          </div>
        )}
      </div>
    </nav>
  );
}

<style jsx global>{`
@keyframes slide-down {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-down {
  animation: slide-down 0.25s cubic-bezier(0.4,0,0.2,1);
}
`}</style>
