import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthSync } from "@/components/AuthSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "DeporteVision — Transmisión en Vivo para Deportes de Salón",
  description:
    "Retransmite, analiza y entrena. La plataforma definitiva para el deporte de salón: streaming en vivo, vídeo bajo demanda y análisis táctico con IA.",
  keywords: [
    "deporte de salón",
    "fútbol sala",
    "básquet",
    "balonmano",
    "voleibol",
    "streaming",
    "análisis IA",
    "DeporteVision",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${dmSans.variable} antialiased bg-[#080A0E] text-[#F0EEE8] font-[family-name:var(--font-body)]`}
      >
        <AuthProvider>
          <AuthSync />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
