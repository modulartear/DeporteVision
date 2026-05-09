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
  title: "DeporteVision — La plataforma de análisis para tu club de pádel",
  description:
    "Ofrecé a tus socios una experiencia profesional. DeporteVision convierte cada partido en tu club en datos reales: grabación automática, análisis con IA y video bajo demanda.",
  keywords: [
    "pádel",
    "club de pádel",
    "análisis deportivo",
    "streaming",
    "análisis IA",
    "DeporteVision",
    "club deportivo",
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
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${dmSans.variable} antialiased bg-[#07090D] text-[#EFEDE7] font-[family-name:var(--font-body)]`}
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
