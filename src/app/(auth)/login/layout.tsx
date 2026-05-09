import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión - DeporteVision AI",
  description: "Inicia sesión en tu cuenta de DeporteVision AI para acceder a tu dashboard de análisis deportivo.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
