import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";
import { StoreInitializer } from "@/lib/StoreInitializer";

export const metadata: Metadata = {
  title: "Imobiliária",
  description: "Aluguel de imóveis em Pelotas",
  keywords: ["aluguel", "imóveis", "Pelotas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <StoreInitializer />
        <Header />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
