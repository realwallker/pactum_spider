import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pactum — Conecta con emprendedores que te complementan",
  description:
    "Plataforma de networking y matching para emprendedores en Ecuador",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
