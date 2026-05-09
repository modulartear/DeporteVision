import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro - DeporteVision AI",
  description: "Creá tu cuenta en DeporteVision AI y comenzá a analizar tus partidos de pádel con inteligencia artificial.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
