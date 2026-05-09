"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

// ─── HERO ────────────────────────────────────────────────────────────
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center-[center_30%] brightness-[0.35] saturate-[0.8] scale-[1.05] transition-transform duration-[8s] ease-out animate-hero-bg"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1400')",
        }}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080A0E] via-[#080A0E]/60 to-[#080A0E]/20" />
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(240,238,232,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(240,238,232,0.03) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 px-6 md:px-12 pb-16 md:pb-20">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 border border-[rgba(200,247,58,0.3)] px-4 py-2 mb-6 animate-[fadeUp_0.8s_ease_forwards] opacity-0">
          <div className="w-2 h-2 bg-[#C8F73A] rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
          <span className="text-[0.72rem] tracking-[0.14em] uppercase text-[#C8F73A]">
            Transmisión en tiempo real
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(4rem,11vw,9.5rem)] leading-[0.9] tracking-tight animate-[fadeUp_0.8s_0.15s_ease_forwards] opacity-0">
          <div>ANALIZA EL</div>
          <div className="[-webkit-text-stroke:1px_rgba(240,238,232,0.3)] text-transparent">
            DEPORTE
          </div>
          <div>
            DE <span className="text-[#C8F73A]">SALA</span>
          </div>
        </h1>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-8 animate-[fadeUp_0.8s_0.3s_ease_forwards] opacity-0">
          <p className="text-base md:text-lg leading-relaxed text-[#9B9D9A] font-light max-w-[420px]">
            Retransmite, analiza y entrena. La plataforma definitiva para el deporte de salón:
            streaming en vivo, vídeo bajo demanda y análisis táctico con IA.
          </p>
          <div className="flex gap-3">
            <Link href="/register">
              <Button className="bg-[#C8F73A] text-[#080A0E] hover:bg-[#C8F73A]/90 text-[0.85rem] tracking-[0.08em] uppercase font-medium px-8 h-12 hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(200,247,58,0.25)] transition-all">
                Comenzar prueba gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-[rgba(240,238,232,0.08)] text-[#F0EEE8] hover:border-[rgba(240,238,232,0.3)] text-[0.85rem] tracking-[0.08em] uppercase font-light px-8 h-12 transition-colors"
              >
                <Play className="mr-2 h-4 w-4" />
                Ver demo en vivo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS ROW ───────────────────────────────────────────────────────
export function StatsSection() {
  const stats = [
    { num: "+200", accent: "200", label: "Clubes activos" },
    { num: "4K", accent: "4", label: "Resolución de cámara" },
    { num: "0ms", accent: "0", label: "Latencia nominal" },
    { num: "8+", accent: "8", label: "Deportes compatibles" },
  ];

  return (
    <div className="reveal flex flex-col md:flex-row border-t border-b border-[rgba(240,238,232,0.08)]">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[rgba(240,238,232,0.08)] last:border-r-0"
        >
          <div className="font-[family-name:var(--font-display)] text-4xl md:text-[3.5rem] leading-none">
            <span className="text-[#C8F73A]">{stat.accent}</span>
            {stat.num.replace(stat.accent, "")}
          </div>
          <div className="text-[0.75rem] tracking-[0.1em] uppercase text-[#9B9D9A] mt-2">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── GALLERY / SPORTS ────────────────────────────────────────────────
export function GallerySection() {
  const [activeSport, setActiveSport] = useState("futsal");

  const sports = [
    { id: "futsal", label: "Fútbol Sala" },
    { id: "basket", label: "Básquet" },
    { id: "handball", label: "Balonmano" },
    { id: "volley", label: "Voleibol" },
  ];

  const panels: Record<string, { items: { span?: boolean; img: string; label: string }[] }> = {
    futsal: {
      items: [
        { span: true, img: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800", label: "FÚTBOL SALA · Partido en vivo" },
        { img: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600", label: "ANÁLISIS DE JUGADAS" },
        { img: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600", label: "HEATMAPS · Zonas de presión" },
        { img: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600", label: "TRACKING · Trayectoria del balón" },
        { img: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600", label: "PORTERO · Eficiencia de paradas" },
      ],
    },
    basket: {
      items: [
        { span: true, img: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800", label: "BÁSQUET · Cobertura total del arena" },
        { img: "https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=600", label: "ANÁLISIS DE LANZAMIENTOS" },
        { img: "https://images.pexels.com/photos/1752753/pexels-photo-1752753.jpeg?auto=compress&cs=tinysrgb&w=600", label: "ESTADÍSTICAS · Tiempo real" },
        { img: "https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=600", label: "TRACKING DE JUGADORES" },
        { img: "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=600", label: "ON DEMAND · Revisá cada jugada" },
      ],
    },
    handball: {
      items: [
        { span: true, img: "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=800", label: "BALONMANO · Seguimiento de equipo" },
        { img: "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=600", label: "ANÁLISIS OFENSIVO" },
        { img: "https://images.pexels.com/photos/3621107/pexels-photo-3621107.jpeg?auto=compress&cs=tinysrgb&w=600", label: "SISTEMA DEFENSIVO" },
        { img: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=600", label: "PORTERO · Zonas de cobertura" },
        { img: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600", label: "HEATMAP · Posesión por zonas" },
      ],
    },
    volley: {
      items: [
        { span: true, img: "https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=800", label: "VOLEIBOL · Cobertura multi-ángulo" },
        { img: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600", label: "REMATE · Análisis de potencia" },
        { img: "https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=600", label: "RECEPCIÓN · Eficiencia" },
        { img: "https://images.pexels.com/photos/1752753/pexels-photo-1752753.jpeg?auto=compress&cs=tinysrgb&w=600", label: "COLOCACIÓN · Estadísticas" },
        { img: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=600", label: "BLOQUEO · Tracking de salto" },
      ],
    },
  };

  const activeItems = panels[activeSport]?.items || [];

  return (
    <section id="gallery" className="px-6 md:px-12 py-16 md:py-24">
      <div className="reveal">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-[#C8F73A]" />
          <span className="text-[0.7rem] tracking-[0.18em] uppercase text-[#C8F73A]">
            Deportes de Salón
          </span>
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] mb-8">
          TODOS TUS
          <br />
          DEPORTES
        </h2>
      </div>

      {/* Sport tabs */}
      <div className="reveal flex gap-0 border-b border-[rgba(240,238,232,0.08)] mb-8 overflow-x-auto scrollbar-none">
        {sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => setActiveSport(sport.id)}
            className={`shrink-0 px-6 md:px-8 py-3 font-[family-name:var(--font-display)] text-lg md:text-xl tracking-[0.05em] transition-colors relative border-none bg-transparent ${
              activeSport === sport.id ? "text-[#C8F73A]" : "text-[#9B9D9A] hover:text-[#F0EEE8]"
            }`}
          >
            {sport.label}
            {activeSport === sport.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8F73A]" />
            )}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] md:grid-rows-[280px_220px] gap-1">
        {activeItems.map((item, i) => (
          <div
            key={`${activeSport}-${i}`}
            className={`gallery-item relative overflow-hidden cursor-pointer group ${
              item.span ? "md:row-span-2" : ""
            } ${i === 0 ? "min-h-[300px] md:min-h-0" : "min-h-[200px] md:min-h-0"}`}
          >
            <img
              src={item.img}
              alt={item.label}
              className="w-full h-full object-cover brightness-[0.7] saturate-[0.7] group-hover:scale-[1.04] group-hover:brightness-[0.85] group-hover:saturate-100 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080A0E]/70 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 font-[family-name:var(--font-display)] text-sm md:text-base tracking-[0.08em] text-[#F0EEE8] [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── VIDEO SECTION ───────────────────────────────────────────────────
export function VideoSection() {
  return (
    <section id="videos" className="px-6 md:px-12 py-16 md:py-24 border-t border-[rgba(240,238,232,0.08)]">
      <div className="reveal">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-[#C8F73A]" />
          <span className="text-[0.7rem] tracking-[0.18em] uppercase text-[#C8F73A]">
            Ejemplo de Transmisión
          </span>
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] mb-8">
          ASÍ SE VE
          <br />
          EN VIVO
        </h2>
      </div>

      <div className="reveal grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-1 mt-8">
        <div>
          <div className="relative aspect-video bg-[#191C23] overflow-hidden border border-[rgba(240,238,232,0.08)]">
            <iframe
              src="https://www.youtube.com/embed/5USpLqsOhRY?rel=0&modestbranding=1"
              title="Fútbol Sala en vivo"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full border-none"
            />
          </div>
          <div className="pt-4">
            <div className="text-[0.65rem] tracking-[0.14em] uppercase text-[#C8F73A] mb-1">
              ● Fútbol Sala · Transmisión de ejemplo
            </div>
            <div className="font-[family-name:var(--font-display)] text-lg tracking-[0.03em]">
              PARTIDO EN VIVO — Análisis táctico completo
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <div className="relative aspect-video bg-[#191C23] overflow-hidden border border-[rgba(240,238,232,0.08)]">
              <iframe
                src="https://www.youtube.com/embed/ZdXPiGcVFiI?rel=0&modestbranding=1"
                title="Basketball análisis"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full border-none"
              />
            </div>
            <div className="pt-2">
              <div className="text-[0.65rem] tracking-[0.14em] uppercase text-[#C8F73A] mb-1">
                Básquet · On Demand
              </div>
              <div className="font-[family-name:var(--font-display)] text-base tracking-[0.03em]">
                Análisis de jugadas
              </div>
            </div>
          </div>
          <div>
            <div className="relative aspect-video bg-[#191C23] overflow-hidden border border-[rgba(240,238,232,0.08)]">
              <iframe
                src="https://www.youtube.com/embed/7UBhQHV7KO0?rel=0&modestbranding=1"
                title="Voleibol transmisión"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full border-none"
              />
            </div>
            <div className="pt-2">
              <div className="text-[0.65rem] tracking-[0.14em] uppercase text-[#C8F73A] mb-1">
                Voleibol · Highlights
              </div>
              <div className="font-[family-name:var(--font-display)] text-base tracking-[0.03em]">
                Mejores jugadas del partido
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="mt-8 p-6 border border-[rgba(240,238,232,0.08)] flex items-center gap-6 reveal">
        <div className="w-12 h-12 border border-[#C8F73A] flex items-center justify-center text-xl text-[#C8F73A] shrink-0">
          ▶
        </div>
        <div>
          <div className="font-[family-name:var(--font-display)] text-base tracking-[0.05em] mb-1">
            ESTAS SON TRANSMISIONES DE EJEMPLO
          </div>
          <div className="text-[0.8rem] text-[#9B9D9A] font-light leading-relaxed">
            Con DeporteVision, tus propios partidos se verán así: en vivo, con overlay de datos,
            tracking de jugadores y disponibles on demand para análisis posterior.
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES BENTO ──────────────────────────────────────────────────
export function FeaturesSection() {
  const features = [
    {
      icon: "▶",
      name: "STREAMING EN VIVO 4K",
      desc: "Retransmite cualquier partido con calidad cinematográfica. Seguimiento automático de jugadores, marcadores en pantalla y hasta 6 ángulos simultáneos.",
      wide: true,
      img: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800",
      badges: ["● REC", "4K · 60fps", "2,341 espectadores"],
    },
    {
      icon: "◈",
      name: "VIDEO ON DEMAND",
      desc: "Biblioteca organizada automáticamente. Clips por evento: goles, faltas, tarjetas y jugadas destacadas al instante.",
      wide: false,
    },
    {
      icon: "⬡",
      name: "ANÁLISIS IA",
      desc: "Detección automática de jugadas, zonas de presión y patrones tácticos mediante visión por computadora en tiempo real.",
      wide: false,
    },
    {
      icon: "◉",
      name: "MAPA DE CALOR",
      desc: "Visualizá la ocupación zonal del equipo. Detectá áreas de alta y baja actividad para mejorar la táctica.",
      wide: false,
    },
    {
      icon: "⊞",
      name: "MULTI-CÁMARA INTELIGENTE",
      desc: "Gestión simultánea de hasta 6 ángulos con conmutación automática según la acción del partido. Sin operador técnico necesario.",
      wide: true,
      img: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800",
      camBadges: ["CAM 1", "CAM 2", "CAM 3", "CAM 4"],
    },
  ];

  return (
    <section id="features" className="px-6 md:px-12 py-16 md:py-24 border-t border-[rgba(240,238,232,0.08)]">
      <div className="reveal">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-[#C8F73A]" />
          <span className="text-[0.7rem] tracking-[0.18em] uppercase text-[#C8F73A]">
            Funcionalidades
          </span>
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] mb-8">
          TODO EN
          <br />
          UNA PLATAFORMA
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(240,238,232,0.08)] border border-[rgba(240,238,232,0.08)] reveal">
        {features.map((feat) => (
          <div
            key={feat.name}
            className={`bg-[#080A0E] p-8 md:p-10 relative overflow-hidden group hover:bg-[#111318] transition-colors ${
              feat.wide ? "md:col-span-2" : ""
            }`}
          >
            <div className="text-2xl mb-5 text-[#C8F73A]">{feat.icon}</div>
            <div className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-[0.02em] mb-3">
              {feat.name}
            </div>
            <p className="text-[0.83rem] leading-relaxed text-[#9B9D9A] font-light">
              {feat.desc}
            </p>

            {/* Feature image */}
            {feat.img && (
              <div className="mt-6 h-[180px] overflow-hidden relative">
                <img
                  src={feat.img}
                  alt={feat.name}
                  className="w-full h-full object-cover brightness-[0.6] saturate-[0.6] group-hover:brightness-[0.8] group-hover:saturate-[0.9] transition-all duration-400"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080A0E]/90 to-transparent" />
                {/* Badges */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {feat.badges?.map((badge, i) => (
                    <div
                      key={i}
                      className={`px-2 py-1 text-[0.6rem] tracking-[0.1em] uppercase ${
                        i === 0
                          ? "text-[#FF5F5F] border-[rgba(240,238,232,0.08)]"
                          : i === 1
                          ? "text-[#3AF7C8] border-[rgba(240,238,232,0.08)]"
                          : "text-[#9B9D9A] border-[rgba(240,238,232,0.08)]"
                      } border bg-[#080A0E]/90`}
                    >
                      {badge}
                    </div>
                  ))}
                  {feat.camBadges?.map((badge, i) => (
                    <div
                      key={i}
                      className={`px-2 py-1 text-[0.6rem] tracking-[0.1em] uppercase border bg-[#080A0E]/90 ${
                        i === 0
                          ? "text-[#C8F73A] border-[rgba(200,247,58,0.3)]"
                          : "text-[#9B9D9A] border-[rgba(240,238,232,0.08)]"
                      }`}
                    >
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accent line on hover */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#C8F73A] group-hover:w-full transition-all duration-400" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ────────────────────────────────────────────────────
export function HowSection() {
  const steps = [
    {
      num: "01",
      title: "CONFIGURÁ",
      desc: "Cámara, encoder y club vinculado en menos de 10 minutos. Sin técnicos ni cables extra.",
    },
    {
      num: "02",
      title: "TRANSMITÍ",
      desc: "Un clic activa el streaming. El sistema detecta jugadores, pelota y marcador automáticamente.",
    },
    {
      num: "03",
      title: "ANALIZÁ",
      desc: "Panel post-partido con heatmaps, stats, clips automáticos y reportes exportables en PDF.",
    },
    {
      num: "04",
      title: "MEJORÁ",
      desc: "Compartí clips con el cuerpo técnico. Detectá errores, corregí patrones, ganás partidos.",
    },
  ];

  return (
    <section className="px-6 md:px-12 py-16 md:py-24 border-t border-[rgba(240,238,232,0.08)]">
      <div className="reveal">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-[#C8F73A]" />
          <span className="text-[0.7rem] tracking-[0.18em] uppercase text-[#C8F73A]">
            Proceso
          </span>
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,6vw,5.5rem)] leading-[0.95]">
          TRES PASOS,
          <br />
          LISTO
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-px mt-8 reveal">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-6 md:p-8 border border-[rgba(240,238,232,0.08)] hover:border-[#C8F73A] hover:bg-[#111318] transition-all group"
          >
            <div className="font-[family-name:var(--font-display)] text-5xl md:text-[4rem] leading-none text-[rgba(240,238,232,0.08)] group-hover:text-[#C8F73A] transition-colors">
              {step.num}
            </div>
            <div className="font-[family-name:var(--font-display)] text-xl md:text-2xl mt-2">
              {step.title}
            </div>
            <p className="text-[0.82rem] leading-relaxed text-[#9B9D9A] font-light mt-2">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PRICING ─────────────────────────────────────────────────────────
export function PricingSection() {
  const plans = [
    {
      tier: "STARTER",
      price: "0",
      desc: "Para clubes que están empezando.",
      features: [
        { text: "5 partidos por mes", included: true },
        { text: "1 cámara compatible", included: true },
        { text: "720p streaming", included: true },
        { text: "7 días de almacenamiento", included: true },
        { text: "Análisis IA", included: false },
      ],
      cta: "Empezar gratis",
      featured: false,
    },
    {
      tier: "PRO",
      price: "49",
      desc: "Para clubes en competencia activa.",
      features: [
        { text: "Partidos ilimitados", included: true },
        { text: "Hasta 3 cámaras", included: true },
        { text: "4K / 60fps", included: true },
        { text: "90 días almacenamiento", included: true },
        { text: "Análisis IA completo", included: true },
        { text: "Exportación MP4 y GIF", included: true },
      ],
      cta: "Comenzar ahora →",
      featured: true,
    },
    {
      tier: "ELITE",
      price: "129",
      desc: "Para federaciones y alto rendimiento.",
      features: [
        { text: "Todo lo de Pro", included: true },
        { text: "Hasta 6 cámaras", included: true },
        { text: "Multi-equipos ilimitados", included: true },
        { text: "Almacenamiento 1 año", included: true },
        { text: "API para integración", included: true },
        { text: "Soporte dedicado 24/7", included: true },
      ],
      cta: "Contactar ventas",
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="px-6 md:px-12 py-16 md:py-24 border-t border-[rgba(240,238,232,0.08)]">
      <div className="reveal">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-[#C8F73A]" />
          <span className="text-[0.7rem] tracking-[0.18em] uppercase text-[#C8F73A]">
            Precios
          </span>
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,6vw,5.5rem)] leading-[0.95]">
          SIN SORPRESAS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(240,238,232,0.08)] border border-[rgba(240,238,232,0.08)] mt-8 reveal">
        {plans.map((plan) => (
          <div
            key={plan.tier}
            className={`bg-[#080A0E] p-8 md:p-10 hover:bg-[#111318] transition-colors ${
              plan.featured ? "bg-[#191C23] border-t-2 border-t-[#C8F73A]" : ""
            }`}
          >
            {plan.featured && (
              <div className="text-[0.65rem] tracking-[0.14em] uppercase text-[#080A0E] bg-[#C8F73A] px-3 py-1 inline-block mb-5">
                MÁS POPULAR
              </div>
            )}
            <div className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-[0.05em]">
              {plan.tier}
            </div>
            <div className="flex items-baseline gap-1 mt-4 mb-2">
              <span className="text-sm text-[#9B9D9A] font-light">$</span>
              <span className="font-[family-name:var(--font-display)] text-5xl md:text-[4rem] leading-none">
                {plan.price}
              </span>
              <span className="text-sm text-[#9B9D9A] font-light">/ mes</span>
            </div>
            <p className="text-[0.8rem] text-[#9B9D9A] font-light mb-5">{plan.desc}</p>
            <ul className="flex flex-col gap-2.5 mb-7">
              {plan.features.map((feat) => (
                <li key={feat.text} className="flex items-center gap-2.5 text-[0.82rem] text-[#9B9D9A] font-light">
                  <div
                    className={`w-4 h-4 border flex items-center justify-center text-[0.55rem] shrink-0 ${
                      feat.included
                        ? "border-[#C8F73A] text-[#C8F73A]"
                        : "border-[#9B9D9A] text-[#9B9D9A]"
                    }`}
                  >
                    {feat.included ? "✓" : "✗"}
                  </div>
                  {!feat.included ? (
                    <span className="opacity-40 line-through">{feat.text}</span>
                  ) : (
                    feat.text
                  )}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block">
              <Button
                className={`w-full justify-center text-[0.85rem] tracking-[0.08em] uppercase h-11 ${
                  plan.featured
                    ? "bg-[#C8F73A] text-[#080A0E] hover:bg-[#C8F73A]/90"
                    : "border border-[rgba(240,238,232,0.08)] bg-transparent text-[#F0EEE8] hover:border-[rgba(240,238,232,0.3)]"
                }`}
                variant={plan.featured ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────
export function CTASection() {
  return (
    <section className="px-6 md:px-12 py-24 md:py-40 text-center relative overflow-hidden border-t border-[rgba(240,238,232,0.08)]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[0.15] saturate-50"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=1400')",
        }}
      />
      <div className="relative z-10 reveal">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(4rem,9vw,8rem)] leading-[0.92]">
          TU PRÓXIMO
          <br />
          <span className="[-webkit-text-stroke:1px_rgba(240,238,232,0.3)] text-transparent">
            CAMPEONATO
          </span>
          <br />
          EMPIEZA
          <br />
          <span className="text-[#C8F73A]">AQUÍ</span>
        </h2>
        <p className="text-[0.9rem] text-[#9B9D9A] font-light mt-8 mb-10">
          Más de 200 clubes ya analizan sus partidos con DeporteVision.
        </p>
        <Link href="/register">
          <Button className="bg-[#C8F73A] text-[#080A0E] hover:bg-[#C8F73A]/90 text-[0.95rem] tracking-[0.08em] uppercase font-medium px-12 h-14 hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(200,247,58,0.25)] transition-all">
            Crear cuenta gratis
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
