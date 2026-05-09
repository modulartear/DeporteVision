"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// ─── Shared helpers ──────────────────────────────────────────────────
const DV = {
  black: "#07090D", white: "#EFEDE7", accent: "#C8F73A", accent2: "#3AF7C8",
  red: "#FF5F5F", amber: "#FFB432", muted: "#8E9090",
  surface: "#0F1217", surface2: "#171B23", surface3: "#1E2330",
  border: "rgba(239,237,231,0.07)", border2: "rgba(239,237,231,0.13)",
};

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-7 h-px bg-[#C8F73A]" />
      <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#C8F73A]">{children}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.93] mb-2">
      {children}
    </h2>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center-[center_25%] brightness-[0.28] saturate-[0.6] scale-[1.06] transition-transform duration-[9s] ease-out"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1400')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-[#07090D]/60 to-[#07090D]/10" />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(239,237,231,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(239,237,231,0.025) 1px,transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />
      <div className="relative z-10 px-6 md:px-12 pb-16 md:pb-20">
        <div className="inline-flex items-center gap-2 border border-[rgba(200,247,58,0.25)] px-3 py-1.5 mb-5 animate-[fadeUp_0.8s_ease_forwards] opacity-0">
          <div className="w-1.5 h-1.5 bg-[#C8F73A] rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" />
          <span className="text-[0.68rem] tracking-[0.15em] uppercase text-[#C8F73A]">Tecnología de análisis para clubes</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(4rem,9.5vw,8.5rem)] leading-[0.88] tracking-tight animate-[fadeUp_0.8s_0.12s_ease_forwards] opacity-0">
          <div>TU CLUB DE</div>
          <div className="[-webkit-text-stroke:1px_rgba(239,237,231,0.25)] text-transparent">PÁDEL</div>
          <div>AL SIGUIENTE <span className="text-[#C8F73A]">NIVEL</span></div>
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-8 animate-[fadeUp_0.8s_0.25s_ease_forwards] opacity-0">
          <p className="text-[0.98rem] leading-[1.75] text-[#8E9090] font-light max-w-[440px]">
            Ofrecé a tus socios una experiencia profesional. <strong className="text-[#EFEDE7] font-normal">DeporteVision</strong> convierte cada partido en tu club en datos reales: grabación automática, análisis con IA y video bajo demanda para que tus jugadores vuelvan siempre.
          </p>
          <div className="flex gap-3">
            <Link href="/register">
              <Button className="bg-[#C8F73A] text-[#07090D] hover:bg-[#C8F73A]/90 text-[0.82rem] tracking-[0.08em] uppercase font-medium px-7 h-12 hover:-translate-y-[3px] hover:shadow-[0_10px_32px_rgba(200,247,58,0.22)] transition-all">
                Solicitar demo gratuita →
              </Button>
            </Link>
            <Link href="/#demo">
              <Button variant="outline" className="border-[rgba(239,237,231,0.13)] text-[#EFEDE7] hover:border-[rgba(239,237,231,0.28)] text-[0.82rem] tracking-[0.08em] uppercase font-light px-7 h-12 transition-colors bg-transparent">
                Ver cómo funciona
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CLIENTS STRIP ───────────────────────────────────────────────────
export function ClientsStrip() {
  const clubs = ["CLUB PALERMO PÁDEL", "TOP SPIN CENTER", "PADEL ARENA BCN", "SPORT CLUB SUR", "RACKET PRO", "VILLA PÁDEL"];
  return (
    <div className="reveal px-6 md:px-12 py-8 border-t border-b border-[rgba(239,237,231,0.07)] flex items-center gap-6 md:gap-12">
      <div className="text-[0.62rem] tracking-[0.16em] uppercase text-[#8E9090] whitespace-nowrap shrink-0">Clubes que ya usan DeporteVision</div>
      <div className="flex gap-8 md:gap-12 items-center overflow-hidden flex-1">
        {clubs.map((club) => (
          <span key={club} className="font-[family-name:var(--font-display)] text-lg tracking-[0.08em] text-[rgba(239,237,231,0.2)] hover:text-[rgba(239,237,231,0.5)] transition-colors whitespace-nowrap">
            {club}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── STATS ───────────────────────────────────────────────────────────
export function StatsSection() {
  const stats = [
    { num: "+40%", accent: "40", label: "Retención de socios", desc: "Los socios que usan el análisis renuevan más." },
    { num: "3hs", accent: "3", label: "Setup inicial", desc: "Instalación y configuración en una sola visita." },
    { num: "+200", accent: "200", label: "Clubes activos", desc: "En Argentina, España y Chile." },
    { num: "0", accent: "0", label: "Operadores necesarios", desc: "Todo automático. Sin personal extra." },
  ];
  return (
    <div className="reveal flex flex-col md:flex-row border-b border-[rgba(239,237,231,0.07)]">
      {stats.map((stat) => (
        <div key={stat.label} className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[rgba(239,237,231,0.07)] last:border-r-0">
          <div className="font-[family-name:var(--font-display)] text-4xl md:text-[3.8rem] leading-none text-[#EFEDE7]">
            +<em className="text-[#C8F73A] not-italic">{stat.accent}</em>{stat.num.replace("+" + stat.accent, "").replace(stat.accent, "")}
          </div>
          <div className="text-[0.7rem] tracking-[0.1em] uppercase text-[#8E9090] mt-1.5">{stat.label}</div>
          <div className="text-[0.78rem] text-[rgba(239,237,231,0.35)] mt-1 font-light">{stat.desc}</div>
        </div>
      ))}
    </div>
  );
}

// ─── VALUE SECTION (B2B) ─────────────────────────────────────────────
export function ValueSection() {
  const cards = [
    { num: "01", icon: "📹", title: "GRABACIÓN AUTOMÁTICA DE TODOS LOS PARTIDOS", desc: "Instalás una cámara por cancha y el sistema hace todo solo. Cada partido queda grabado, procesado y disponible para el socio sin intervención del staff.", chips: [{ text: "Sin operadores", color: "g" }, { text: "4K automático", color: "b" }, { text: "Activo 24/7", color: "a" }] },
    { num: "02", icon: "📊", title: "ANÁLISIS QUE TUS SOCIOS VAN A QUERER CONSUMIR", desc: "Cada socio accede a su historial de partidos, heatmaps, detección de errores y clips automáticos desde la app. Tu club ofrece algo que nadie más tiene.", chips: [{ text: "Errores detectados", color: "r" }, { text: "Puntos fuertes", color: "g" }, { text: "Evolución mensual", color: "a" }] },
    { num: "03", icon: "💼", title: "NUEVA FUENTE DE INGRESOS PARA EL CLUB", desc: "Ofrecé el análisis como servicio premium, incluido en membresías superiores o como add-on por partido. Los clubes que lo usan reportan un aumento de ticket promedio.", chips: [{ text: "Membresías premium", color: "g" }, { text: "Add-on por partido", color: "b" }] },
    { num: "04", icon: "🔒", title: "FIDELIZACIÓN Y RETENCIÓN DE SOCIOS", desc: "Los socios que usan el análisis de video tienen un 40% más de probabilidad de renovar su membresía. Los datos crean hábito, el hábito crea fidelidad.", chips: [{ text: "+40% retención", color: "g" }, { text: "NPS más alto", color: "a" }] },
  ];

  const chipColor = (c: string) => {
    switch (c) {
      case "r": return "bg-[rgba(255,95,95,0.12)] border-[rgba(255,95,95,0.25)] text-[#FF5F5F]";
      case "a": return "bg-[rgba(255,180,50,0.1)] border-[rgba(255,180,50,0.22)] text-[#FFB432]";
      case "g": return "bg-[rgba(200,247,58,0.08)] border-[rgba(200,247,58,0.2)] text-[#C8F73A]";
      case "b": return "bg-[rgba(58,247,200,0.08)] border-[rgba(58,247,200,0.2)] text-[#3AF7C8]";
      default: return "";
    }
  };

  return (
    <section id="value" className="px-6 md:px-12 py-16 md:py-28 border-t border-[rgba(239,237,231,0.07)]">
      <div className="reveal">
        <SectionTag>Para el establecimiento</SectionTag>
        <SectionTitle>LO QUE TU CLUB<br />GANA CON ESTO</SectionTitle>
        <p className="text-[0.92rem] leading-[1.75] text-[#8E9090] font-light max-w-[560px] mb-10">
          DeporteVision es el servicio que tu club ofrece a sus socios. Vos instalás la tecnología, nosotros hacemos el resto. Tus jugadores se van a querer quedar.
        </p>
      </div>

      <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-1">
        {/* Visual panel */}
        <div className="relative overflow-hidden min-h-[400px] md:min-h-[560px] bg-[#171B23]">
          <img src="https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Club de pádel" className="w-full h-full object-cover brightness-[0.35] saturate-[0.5]" />
          {/* UI Panels overlay */}
          <div className="absolute top-5 left-5 right-5 flex flex-col gap-2">
            <div className="bg-[rgba(7,9,13,0.88)] border border-[rgba(239,237,231,0.13)] backdrop-blur-md p-3.5">
              <div className="text-[0.58rem] tracking-[0.14em] uppercase text-[#C8F73A] mb-2">Panel del club — Actividad de hoy</div>
              <div className="flex items-center gap-2.5 py-1.5 border-b border-[rgba(239,237,231,0.07)] last:border-b-0">
                <span className="text-[0.68rem] text-[#8E9090] flex-1 tracking-[0.04em]">Cancha 1 — Partido en curso</span>
                <span className={`text-[0.58rem] tracking-[0.1em] uppercase px-2 py-0.5 ${chipColor("r")}`}>● GRABANDO</span>
              </div>
              <div className="flex items-center gap-2.5 py-1.5 border-b border-[rgba(239,237,231,0.07)]">
                <span className="text-[0.68rem] text-[#8E9090] flex-1 tracking-[0.04em]">Cancha 2 — Análisis disponible</span>
                <span className={`text-[0.58rem] tracking-[0.1em] uppercase px-2 py-0.5 ${chipColor("g")}`}>✓ LISTO</span>
              </div>
              <div className="flex items-center gap-2.5 py-1.5">
                <span className="text-[0.68rem] text-[#8E9090] flex-1 tracking-[0.04em]">Cancha 3 — Próximo turno 18:00</span>
                <span className={`text-[0.58rem] tracking-[0.1em] uppercase px-2 py-0.5 ${chipColor("a")}`}>RESERVADO</span>
              </div>
            </div>
            <div className="bg-[rgba(7,9,13,0.88)] border border-[rgba(239,237,231,0.13)] backdrop-blur-md p-3.5">
              <div className="text-[0.58rem] tracking-[0.14em] uppercase text-[#C8F73A] mb-2">Rendimiento del socio — Juan M.</div>
              {[
                { label: "Efectividad de smash", pct: 82, color: "#C8F73A" },
                { label: "Cobertura de cancha", pct: 58, color: "#FFB432" },
                { label: "Errores no forzados", pct: 31, color: "#FF5F5F" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2.5 py-1.5 border-b border-[rgba(239,237,231,0.07)] last:border-b-0">
                  <span className="text-[0.68rem] text-[#8E9090] flex-1 tracking-[0.04em]">{row.label}</span>
                  <div className="w-[90px] h-[3px] bg-[rgba(239,237,231,0.08)] rounded-sm overflow-hidden">
                    <div className="h-full rounded-sm" style={{ width: `${row.pct}%`, background: row.color }} />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[0.95rem] min-w-[34px] text-right" style={{ color: row.color }}>{row.pct}%</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className={`text-[0.58rem] tracking-[0.1em] uppercase px-2 py-1 ${chipColor("b")}`}>📹 4 canchas activas</span>
              <span className={`text-[0.58rem] tracking-[0.1em] uppercase px-2 py-1 ${chipColor("g")}`}>12 análisis esta semana</span>
              <span className={`text-[0.58rem] tracking-[0.1em] uppercase px-2 py-1 ${chipColor("a")}`}>8 socios nuevos este mes</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-16 bg-gradient-to-t from-[#07090D] to-transparent">
            <div className="font-[family-name:var(--font-display)] text-2xl mb-1.5">TU CLUB, MÁS PROFESIONAL</div>
            <p className="text-[0.8rem] text-[#8E9090] font-light leading-[1.6] max-w-[320px]">Tus socios reciben un análisis profesional de cada partido. Eso los fideliza y diferencia tu club de la competencia.</p>
          </div>
        </div>

        {/* Value cards */}
        <div className="flex flex-col gap-1">
          {cards.map((card) => (
            <div key={card.num} className="bg-[#0F1217] p-6 md:p-8 border border-[rgba(239,237,231,0.07)] hover:bg-[#171B23] hover:border-[rgba(200,247,58,0.12)] transition-all relative overflow-hidden group cursor-default">
              <div className="font-[family-name:var(--font-display)] text-[4.5rem] leading-none text-[rgba(239,237,231,0.03)] absolute right-4 top-1 pointer-events-none">{card.num}</div>
              <div className="text-xl mb-2.5">{card.icon}</div>
              <div className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-[0.02em] mb-2">{card.title}</div>
              <p className="text-[0.81rem] leading-[1.72] text-[#8E9090] font-light">{card.desc}</p>
              <div className="flex gap-1.5 flex-wrap mt-3">
                {card.chips.map((chip) => (
                  <span key={chip.text} className={`text-[0.58rem] tracking-[0.1em] uppercase px-2 py-0.5 border ${chipColor(chip.color)}`}>
                    {chip.text}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#C8F73A] group-hover:w-full transition-all duration-400" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW SECTION ─────────────────────────────────────────────────────
export function HowSection() {
  const steps = [
    { num: "01", icon: "📐", title: "INSTALACIÓN EN TU ESTABLECIMIENTO", desc: "Nuestro equipo visita tu club e instala las cámaras en cada cancha. El proceso demora entre 2 y 4 horas según la cantidad de canchas. Sin obras, sin cableado complejo." },
    { num: "02", icon: "⚙️", title: "CONFIGURACIÓN DE TU PANEL DE GESTIÓN", desc: "Accedés a un panel de administración donde ves todas las canchas en tiempo real, gestionás los socios y controlás qué partidos se graban y cuáles no." },
    { num: "03", icon: "👥", title: "TUS SOCIOS SE REGISTRAN EN LA APP", desc: "Cada socio descarga la app, se vincula al club y a partir del primer partido ya tiene acceso a su historial, análisis y clips. Sin configuración adicional de tu parte." },
    { num: "04", icon: "💰", title: "OFRECÉS EL SERVICIO Y GENERÁS VALOR", desc: "Decidís si el análisis va incluido en la membresía o como servicio adicional. Nosotros te asesoramos en cómo monetizarlo según el perfil de tu club." },
  ];

  return (
    <section id="how" className="px-6 md:px-12 py-16 md:py-28 border-t border-[rgba(239,237,231,0.07)] bg-[#0F1217]">
      <div className="reveal">
        <SectionTag>Implementación</SectionTag>
        <SectionTitle>ASÍ LO IMPLEMENTÁS<br />EN TU CLUB</SectionTitle>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-10 reveal">
        {steps.map((step) => (
          <div key={step.num} className="p-6 md:p-7 border border-[rgba(239,237,231,0.07)] hover:border-[#C8F73A] hover:bg-[#171B23] transition-all relative overflow-hidden bg-[#07090D]">
            <div className="font-[family-name:var(--font-display)] text-[5rem] leading-none text-[rgba(239,237,231,0.04)] hover:text-[rgba(200,247,58,0.1)] transition-colors mb-[-0.5rem]">{step.num}</div>
            <div className="text-xl text-[#C8F73A] mb-2.5">{step.icon}</div>
            <div className="font-[family-name:var(--font-display)] text-xl md:text-[1.3rem] mb-2 leading-[1.1]">{step.title}</div>
            <p className="text-[0.79rem] leading-[1.72] text-[#8E9090] font-light">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── DEMO SECTION (SVG Padel Court) ──────────────────────────────────
export function DemoSection() {
  return (
    <section id="demo" className="px-6 md:px-12 py-16 md:py-28 border-t border-[rgba(239,237,231,0.07)]">
      <div className="reveal">
        <SectionTag>Demo de análisis</SectionTag>
        <SectionTitle>LO QUE VE TU SOCIO<br />DESPUÉS DE CADA PARTIDO</SectionTitle>
        <p className="text-[0.92rem] leading-[1.75] text-[#8E9090] font-light max-w-[560px] mb-10">
          Esto es lo que recibe cada jugador de tu club automáticamente al terminar el partido. Sin edición manual, sin trabajo extra de tu staff.
        </p>
      </div>

      <div className="reveal grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-1 mt-10">
        {/* SVG Court */}
        <div className="relative overflow-hidden aspect-[4/3] bg-[#171B23] border border-[rgba(239,237,231,0.07)]">
          <svg width="100%" height="100%" viewBox="0 0 500 375" xmlns="http://www.w3.org/2000/svg">
            <rect width="500" height="375" fill="#0B0D12"/>
            <rect x="35" y="35" width="430" height="305" rx="3" fill="none" stroke="rgba(239,237,231,0.18)" strokeWidth="2"/>
            <rect x="28" y="28" width="444" height="319" rx="4" fill="none" stroke="rgba(239,237,231,0.05)" strokeWidth="1"/>
            <line x1="250" y1="35" x2="250" y2="340" stroke="rgba(239,237,231,0.35)" strokeWidth="2.5"/>
            <line x1="250" y1="35" x2="250" y2="340" stroke="rgba(239,237,231,0.08)" strokeWidth="6"/>
            <line x1="35" y1="187" x2="250" y2="187" stroke="rgba(239,237,231,0.1)" strokeWidth="1"/>
            <line x1="250" y1="187" x2="465" y2="187" stroke="rgba(239,237,231,0.1)" strokeWidth="1"/>
            <line x1="140" y1="35" x2="140" y2="340" stroke="rgba(239,237,231,0.07)" strokeWidth="1"/>
            <line x1="360" y1="35" x2="360" y2="340" stroke="rgba(239,237,231,0.07)" strokeWidth="1"/>
            {/* Heatmaps */}
            <ellipse cx="72" cy="187" rx="45" ry="70" fill="rgba(255,95,95,0.14)"/>
            <ellipse cx="68" cy="187" rx="25" ry="42" fill="rgba(255,95,95,0.22)"/>
            <ellipse cx="65" cy="187" rx="12" ry="22" fill="rgba(255,95,95,0.38)"/>
            <ellipse cx="250" cy="58" rx="80" ry="28" fill="rgba(255,180,50,0.12)"/>
            <ellipse cx="250" cy="56" rx="45" ry="16" fill="rgba(255,180,50,0.18)"/>
            <ellipse cx="380" cy="187" rx="65" ry="55" fill="rgba(200,247,58,0.07)"/>
            <ellipse cx="382" cy="187" rx="38" ry="30" fill="rgba(200,247,58,0.12)"/>
            {/* Ball trajectories */}
            <path d="M 250 187 Q 150 140 72 187" fill="none" stroke="rgba(255,95,95,0.45)" strokeWidth="1.5" strokeDasharray="6,4"/>
            <path d="M 250 187 Q 200 60 140 50" fill="none" stroke="rgba(255,180,50,0.38)" strokeWidth="1.5" strokeDasharray="6,4"/>
            <path d="M 250 187 Q 340 150 390 120" fill="none" stroke="rgba(200,247,58,0.45)" strokeWidth="1.5" strokeDasharray="4,3"/>
            {/* Zone markers */}
            <circle cx="72" cy="187" r="9" fill="none" stroke="#FF5F5F" strokeWidth="1.5"/>
            <circle cx="72" cy="187" r="4" fill="#FF5F5F"/>
            <rect x="88" y="176" width="88" height="32" rx="2" fill="rgba(7,9,13,0.9)"/>
            <text x="93" y="188" fill="#FF5F5F" fontSize="8" fontFamily="DM Sans" fontWeight="500">ZONA CRÍTICA</text>
            <text x="93" y="200" fill="rgba(255,95,95,0.55)" fontSize="7" fontFamily="DM Sans">14 puntos perdidos</text>
            <circle cx="385" cy="187" r="9" fill="none" stroke="#C8F73A" strokeWidth="1.5"/>
            <circle cx="385" cy="187" r="4" fill="#C8F73A"/>
            <rect x="295" y="176" width="82" height="32" rx="2" fill="rgba(7,9,13,0.9)"/>
            <text x="300" y="188" fill="#C8F73A" fontSize="8" fontFamily="DM Sans" fontWeight="500">ZONA FUERTE</text>
            <text x="300" y="200" fill="rgba(200,247,58,0.55)" fontSize="7" fontFamily="DM Sans">89% ganados</text>
            <circle cx="250" cy="56" r="7" fill="none" stroke="#FFB432" strokeWidth="1.5"/>
            <circle cx="250" cy="56" r="3" fill="#FFB432"/>
            <rect x="258" y="45" width="90" height="22" rx="2" fill="rgba(7,9,13,0.9)"/>
            <text x="263" y="60" fill="#FFB432" fontSize="8" fontFamily="DM Sans" fontWeight="500">FONDO: 9 errores</text>
            {/* Players */}
            <circle cx="120" cy="230" r="7" fill="#C8F73A" opacity="0.9" stroke="rgba(200,247,58,0.4)" strokeWidth="2">
              <animate attributeName="cx" values="120;115;125;120" dur="3s" repeatCount="indefinite"/>
            </circle>
            <text x="112" y="253" fill="rgba(200,247,58,0.7)" fontSize="7" fontFamily="DM Sans">P1</text>
            <circle cx="180" cy="140" r="7" fill="#C8F73A" opacity="0.85" stroke="rgba(200,247,58,0.3)" strokeWidth="2">
              <animate attributeName="cy" values="140;132;148;140" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <text x="172" y="163" fill="rgba(200,247,58,0.7)" fontSize="7" fontFamily="DM Sans">P2</text>
            <circle cx="350" cy="220" r="7" fill="#3AF7C8" opacity="0.9" stroke="rgba(58,247,200,0.4)" strokeWidth="2">
              <animate attributeName="cx" values="350;355;345;350" dur="2.8s" repeatCount="indefinite"/>
            </circle>
            <text x="342" y="243" fill="rgba(58,247,200,0.7)" fontSize="7" fontFamily="DM Sans">R1</text>
            <circle cx="400" cy="130" r="7" fill="#3AF7C8" opacity="0.85" stroke="rgba(58,247,200,0.3)" strokeWidth="2">
              <animate attributeName="cy" values="130;122;138;130" dur="3.2s" repeatCount="indefinite"/>
            </circle>
            <text x="392" y="153" fill="rgba(58,247,200,0.7)" fontSize="7" fontFamily="DM Sans">R2</text>
            {/* Ball */}
            <circle cx="250" cy="187" r="5" fill="white" opacity="0.85"/>
            {/* Timeline */}
            <rect x="0" y="350" width="500" height="25" fill="rgba(7,9,13,0.95)"/>
            <rect x="0" y="350" width="195" height="25" fill="rgba(200,247,58,0.1)"/>
            <rect x="0" y="350" width="195" height="2" fill="#C8F73A" opacity="0.6"/>
            <text x="200" y="365" fill="rgba(239,237,231,0.4)" fontSize="7.5" fontFamily="DM Sans" letterSpacing="0.8">MINUTO 28 / 40 — ANÁLISIS EN TIEMPO REAL</text>
            {/* Scan line */}
            <rect x="35" y="35" width="430" height="1.5" fill="rgba(200,247,58,0.08)">
              <animateTransform attributeName="transform" type="translate" values="0,0;0,305;0,0" dur="5s" repeatCount="indefinite"/>
            </rect>
          </svg>
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
            <div className="bg-[rgba(7,9,13,0.92)] border border-[rgba(239,237,231,0.13)] px-2.5 py-1 text-[0.58rem] tracking-[0.1em] uppercase text-[#FF5F5F]">● REC · GRABANDO</div>
            <div className="bg-[rgba(7,9,13,0.92)] border border-[rgba(239,237,231,0.13)] px-2.5 py-1 text-[0.58rem] tracking-[0.1em] uppercase text-[#8E9090]">PÁDEL · CANCHA 1 · 4K</div>
          </div>
        </div>

        {/* Sidebar metrics */}
        <div className="flex flex-col gap-1">
          {[
            { label: "Error crítico detectado", title: "COBERTURA LATERAL", score: "32%", color: "#FF5F5F", pct: 32, note: "La pareja abandona el lateral izquierdo en el 71% de los ataques rivales. El rival lo explota desde la pared para ganar el punto." },
            { label: "Área de mejora", title: "SMASH AL FONDO", score: "51%", color: "#FFB432", pct: 51, note: "El smash al fondo tiene solo 51% de efectividad. La IA detectó que la mayoría van al centro, donde el rival los espera." },
            { label: "Punto fuerte", title: "VOLEA CRUZADA", score: "89%", color: "#C8F73A", pct: 89, note: "La volea cruzada al sector de ventaja tiene un 89% de efectividad. Es la jugada ganadora del equipo. Hay que usarla más." },
          ].map((card) => (
            <div key={card.title} className="bg-[#0F1217] border border-[rgba(239,237,231,0.07)] p-5 hover:bg-[#171B23] transition-colors">
              <div className="flex items-start justify-between mb-2.5">
                <div>
                  <div className="text-[0.58rem] tracking-[0.13em] uppercase" style={{ color: card.color }}>{card.label}</div>
                  <div className="font-[family-name:var(--font-display)] text-[1.05rem] tracking-[0.03em]">{card.title}</div>
                </div>
                <div className="font-[family-name:var(--font-display)] text-[2.2rem] leading-none" style={{ color: card.color }}>{card.score}</div>
              </div>
              <div className="h-[3px] bg-[rgba(239,237,231,0.07)] my-2">
                <div className="h-full" style={{ width: `${card.pct}%`, background: card.color }} />
              </div>
              <p className="text-[0.7rem] text-[#8E9090] leading-[1.55] font-light">{card.note}</p>
            </div>
          ))}
          {/* Summary card */}
          <div className="bg-[#0F1217] border border-[rgba(239,237,231,0.07)] p-5 hover:bg-[#171B23] transition-colors">
            <div className="text-[0.58rem] tracking-[0.13em] uppercase text-[#3AF7C8] mb-1">Estadística del partido</div>
            <div className="font-[family-name:var(--font-display)] text-[1.05rem] tracking-[0.03em] mb-2">RESUMEN FINAL</div>
            <div className="grid grid-cols-2 gap-1">
              {[
                { val: "78%", label: "Posesión", color: "#C8F73A" },
                { val: "23", label: "Puntos ganados", color: "#EFEDE7" },
                { val: "14", label: "Errores no forz.", color: "#FF5F5F" },
                { val: "6", label: "Clips generados", color: "#3AF7C8" },
              ].map((s) => (
                <div key={s.label} className="text-center p-2 bg-[#171B23]">
                  <div className="font-[family-name:var(--font-display)] text-[1.6rem]" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[0.58rem] tracking-[0.08em] uppercase text-[#8E9090] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── GALLERY SECTION ─────────────────────────────────────────────────
export function GallerySection() {
  const [activeSport, setActiveSport] = useState("padel");
  const sports = [
    { id: "padel", label: "Pádel" },
    { id: "tenis", label: "Tenis de Salón" },
    { id: "squash", label: "Squash" },
    { id: "futsal", label: "Fútbol Sala" },
  ];

  const panels: Record<string, { items: { span?: boolean; img: string; label: string; chips?: { text: string; color: string }[] }[]; extras?: { label: string; title: string }[] }> = {
    padel: {
      items: [
        { span: true, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Padel_court_-_Padel_Pro_Tour.jpg/1280px-Padel_court_-_Padel_Pro_Tour.jpg", label: "PÁDEL · Club con 4 canchas · Instalación completa", chips: [{ text: "● 4 canchas activas", color: "g" }, { text: "Setup en 1 día", color: "b" }] },
        { img: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600", label: "PARTIDO · Grabación automática 4K" },
        { img: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600", label: "VISTA CENITAL · Tracking de jugadores" },
        { img: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600", label: "ON DEMAND · Clips para los socios" },
        { img: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600", label: "ANÁLISIS · Heatmap de cancha" },
      ],
      extras: [
        { label: "Análisis pádel", title: "Efectividad de smash" },
        { label: "Análisis pádel", title: "Uso de paredes" },
        { label: "Análisis pádel", title: "Cobertura en pareja" },
        { label: "Análisis pádel", title: "Errores no forzados" },
        { label: "Análisis pádel", title: "Posición en cancha" },
      ],
    },
    tenis: {
      items: [
        { span: true, img: "https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=800", label: "TENIS · Análisis de golpes y posicionamiento", chips: [{ text: "Compatibilidad total", color: "b" }] },
        { img: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600", label: "SAQUE · Velocidad y dirección" },
        { img: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600", label: "VOLEA · Análisis de red" },
        { img: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600", label: "MAPA · Zonas de golpe" },
        { img: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600", label: "CLIPS · Puntos clave automáticos" },
      ],
    },
    squash: {
      items: [
        { span: true, img: "https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=800", label: "SQUASH · Tracking de movimiento y pared", chips: [{ text: "Cámara de alta velocidad", color: "a" }] },
        { img: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600", label: "GOLPE · Análisis de impacto" },
        { img: "https://images.pexels.com/photos/1752753/pexels-photo-1752753.jpeg?auto=compress&cs=tinysrgb&w=600", label: "MOVIMIENTO · Cobertura de cancha" },
        { img: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600", label: "HEATMAP · Zonas de mayor error" },
        { img: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600", label: "ON DEMAND · Jugadas clave" },
      ],
    },
    futsal: {
      items: [
        { span: true, img: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800", label: "FÚTBOL SALA · Análisis táctico de equipo", chips: [{ text: "Multi-jugador tracking", color: "g" }] },
        { img: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600", label: "ATAQUE · Sistema ofensivo" },
        { img: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600", label: "HEATMAP · Posesión por zonas" },
        { img: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600", label: "TRACKING · Trayectoria del balón" },
        { img: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600", label: "PORTERO · Análisis de paradas" },
      ],
    },
  };

  const chipColor = (c: string) => {
    switch (c) {
      case "r": return "bg-[rgba(255,95,95,0.12)] border-[rgba(255,95,95,0.25)] text-[#FF5F5F]";
      case "a": return "bg-[rgba(255,180,50,0.1)] border-[rgba(255,180,50,0.22)] text-[#FFB432]";
      case "g": return "bg-[rgba(200,247,58,0.08)] border-[rgba(200,247,58,0.2)] text-[#C8F73A]";
      case "b": return "bg-[rgba(58,247,200,0.08)] border-[rgba(58,247,200,0.2)] text-[#3AF7C8]";
      default: return "";
    }
  };

  const active = panels[activeSport];

  return (
    <section id="gallery" className="px-6 md:px-12 py-16 md:py-28 border-t border-[rgba(239,237,231,0.07)]">
      <div className="reveal">
        <SectionTag>Deportes compatibles</SectionTag>
        <SectionTitle>FUNCIONA EN TU<br />TIPO DE CLUB</SectionTitle>
      </div>

      <div className="reveal flex gap-0 border-b border-[rgba(239,237,231,0.07)] mb-8 overflow-x-auto">
        {sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => setActiveSport(sport.id)}
            className={`shrink-0 px-6 md:px-8 py-3 font-[family-name:var(--font-display)] text-lg md:text-xl tracking-[0.05em] transition-colors relative border-none bg-transparent ${
              activeSport === sport.id ? "text-[#C8F73A]" : "text-[#8E9090] hover:text-[#EFEDE7]"
            }`}
          >
            {sport.label}
            {activeSport === sport.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8F73A]" />}
          </button>
        ))}
      </div>

      {active && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-[1.55fr_1fr_1fr] md:grid-rows-[280px_210px] gap-1">
            {active.items.map((item, i) => (
              <div
                key={`${activeSport}-${i}`}
                className={`relative overflow-hidden cursor-default group ${item.span ? "md:row-span-2" : ""} ${i === 0 ? "min-h-[300px] md:min-h-0" : "min-h-[200px] md:min-h-0"}`}
              >
                <img src={item.img} alt={item.label} className="w-full h-full object-cover brightness-[0.6] saturate-[0.55] group-hover:scale-[1.04] group-hover:brightness-[0.8] group-hover:saturate-90 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090D]/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 font-[family-name:var(--font-display)] text-sm tracking-[0.07em] text-[#EFEDE7] [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">{item.label}</div>
                {item.chips && (
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {item.chips.map((chip) => (
                      <span key={chip.text} className={`text-[0.58rem] tracking-[0.1em] uppercase px-2 py-0.5 border ${chipColor(chip.color)}`}>{chip.text}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Extra analysis chips for padel */}
          {active.extras && (
            <div className="mt-1 grid grid-cols-2 md:grid-cols-5 gap-1">
              {active.extras.map((extra) => (
                <div key={extra.title} className="bg-[#0F1217] p-4 border border-[rgba(239,237,231,0.07)]">
                  <div className="text-[0.55rem] tracking-[0.12em] uppercase text-[#8E9090] mb-1">{extra.label}</div>
                  <div className="font-[family-name:var(--font-display)] text-[0.9rem]">{extra.title}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────
export function TestimonialsSection() {
  const testimonials = [
    { quote: "Instalamos DeporteVision en nuestras 4 canchas y en tres meses nuestros socios más activos aumentaron su frecuencia de juego un 60%. La herramienta de análisis es lo que más valoran cuando les preguntamos por qué renuevan.", name: "Martín Rodríguez", role: "Director — Club Palermo Pádel · Buenos Aires", initials: "MR" },
    { quote: "Lo que más nos sorprendió fue lo fácil que fue implementarlo. En una mañana ya estaba todo funcionando. Nuestros socios lo adoptaron solos, sin que tuviéramos que explicar nada. Ahora es parte del diferencial que usamos para captar nuevos miembros.", name: "Carolina López", role: "Administradora — Top Spin Center · Rosario", initials: "CL" },
    { quote: "Agregamos DeporteVision como servicio premium en nuestra membresía Gold y fue la decisión correcta. Los socios que tienen esa membresía tienen un 45% menos de bajas. El análisis post-partido es el beneficio que más mencionan.", name: "Pablo Fernández", role: "Propietario — Sport Club Sur · Córdoba", initials: "PF" },
  ];

  return (
    <section className="px-6 md:px-12 py-16 md:py-28 border-t border-[rgba(239,237,231,0.07)] bg-[#0F1217]">
      <div className="reveal">
        <SectionTag>Casos de éxito</SectionTag>
        <SectionTitle>LO QUE DICEN<br />LOS CLUBES</SectionTitle>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-10 reveal">
        {testimonials.map((t) => (
          <div key={t.initials} className="bg-[#07090D] p-6 border border-[rgba(239,237,231,0.07)] hover:bg-[#171B23] transition-colors">
            <p className="text-[0.88rem] leading-[1.75] text-[rgba(239,237,231,0.7)] font-light italic mb-5">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#171B23] flex items-center justify-center font-[family-name:var(--font-display)] text-base text-[#C8F73A] border border-[rgba(239,237,231,0.13)]">{t.initials}</div>
              <div>
                <div className="text-[0.8rem] font-medium text-[#EFEDE7]">{t.name}</div>
                <div className="text-[0.7rem] text-[#8E9090] mt-0.5">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PRICING B2B ─────────────────────────────────────────────────────
export function PricingSection() {
  const plans = [
    {
      tier: "CLUB STARTER",
      tagline: "Para clubes de hasta 2 canchas que quieren empezar con la tecnología de análisis.",
      price: "149",
      per: "/ mes por club",
      features: [
        { text: "Hasta 2 canchas con cámara", included: true },
        { text: "Grabación en 1080p automática", included: true },
        { text: "Panel de gestión del club", included: true },
        { text: "App para los socios incluida", included: true },
        { text: "30 días de almacenamiento", included: true },
        { text: "Soporte por email", included: true },
        { text: "Análisis de errores con IA", included: false },
      ],
      cta: "Solicitar información",
      featured: false,
    },
    {
      tier: "CLUB PRO",
      tagline: "Para clubes con 3 a 6 canchas que quieren ofrecer análisis profesional a sus socios.",
      price: "349",
      per: "/ mes por club",
      features: [
        { text: "Hasta 6 canchas con cámara", included: true },
        { text: "Grabación en 4K / 60fps", included: true },
        { text: "Panel de gestión avanzado", included: true },
        { text: "App con análisis de IA incluida", included: true },
        { text: "Heatmaps y detección de errores", included: true },
        { text: "Clips automáticos por evento", included: true },
        { text: "90 días de almacenamiento", included: true },
        { text: "Soporte prioritario 7 días", included: true },
        { text: "Informes para entrenadores", included: true },
      ],
      cta: "Solicitar demo gratuita →",
      featured: true,
    },
    {
      tier: "CLUB ELITE",
      tagline: "Para federaciones, academias y clubes con más de 6 canchas o múltiples sedes.",
      price: "A MEDIDA",
      per: "",
      features: [
        { text: "Canchas ilimitadas", included: true },
        { text: "Múltiples sedes en un panel", included: true },
        { text: "Integración con tu sistema de reservas", included: true },
        { text: "API personalizada", included: true },
        { text: "Almacenamiento por 1 año", included: true },
        { text: "Account manager dedicado", included: true },
        { text: "Soporte 24/7 con SLA garantizado", included: true },
        { text: "Capacitación del staff incluida", included: true },
      ],
      cta: "Hablar con ventas →",
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="px-6 md:px-12 py-16 md:py-28 border-t border-[rgba(239,237,231,0.07)]">
      <div className="reveal">
        <SectionTag>Planes para clubes</SectionTag>
        <SectionTitle>ELEGÍ EL PLAN<br />PARA TU CLUB</SectionTitle>
        <p className="text-[0.82rem] text-[#8E9090] font-light max-w-[560px] leading-[1.6] mb-10">
          Los precios son por establecimiento, no por socio. Incluyen instalación, soporte técnico y actualizaciones. Tus socios acceden a la app sin costo adicional para el club.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(239,237,231,0.07)] border border-[rgba(239,237,231,0.07)] reveal">
        {plans.map((plan) => (
          <div key={plan.tier} className={`bg-[#07090D] p-8 md:p-10 hover:bg-[#0F1217] transition-colors relative ${plan.featured ? "bg-[#171B23] border-t-2 border-t-[#C8F73A]" : ""}`}>
            {plan.featured && <div className="text-[0.6rem] tracking-[0.14em] uppercase text-[#07090D] bg-[#C8F73A] px-2.5 py-1 inline-block mb-4">MÁS ELEGIDO</div>}
            <div className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-[0.06em]">{plan.tier}</div>
            <p className="text-[0.75rem] text-[#8E9090] font-light mt-1 mb-4 leading-[1.5]">{plan.tagline}</p>
            <div className="flex items-baseline gap-1 my-3">
              <span className="text-sm text-[#8E9090] font-light">{plan.price !== "A MEDIDA" ? "$" : ""}</span>
              <span className={`font-[family-name:var(--font-display)] leading-none ${plan.price === "A MEDIDA" ? "text-[2.8rem]" : "text-[3.8rem]"}`}>{plan.price}</span>
              <span className="text-sm text-[#8E9090] font-light">{plan.per}</span>
            </div>
            <ul className="flex flex-col gap-2 my-5">
              {plan.features.map((feat) => (
                <li key={feat.text} className="flex items-start gap-2 text-[0.79rem] text-[#8E9090] font-light leading-[1.4]">
                  <div className={`w-[15px] h-[15px] border flex items-center justify-center text-[0.5rem] shrink-0 mt-[1px] ${feat.included ? "border-[#C8F73A] text-[#C8F73A]" : "border-[#8E9090] text-[#8E9090]"}`}>
                    {feat.included ? "✓" : "✗"}
                  </div>
                  {!feat.included ? <span className="opacity-40 line-through">{feat.text}</span> : feat.text}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block">
              <Button
                className={`w-full justify-center text-[0.82rem] tracking-[0.08em] uppercase h-11 ${
                  plan.featured
                    ? "bg-[#C8F73A] text-[#07090D] hover:bg-[#C8F73A]/90"
                    : "border border-[rgba(239,237,231,0.13)] bg-transparent text-[#EFEDE7] hover:border-[rgba(239,237,231,0.28)]"
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
    <section id="contact" className="px-6 md:px-12 py-24 md:py-36 text-center relative overflow-hidden border-t border-[rgba(239,237,231,0.07)]">
      <div className="absolute inset-0 bg-cover bg-center brightness-[0.1] saturate-30" style={{ backgroundImage: "url('https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1400')" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(200,247,58,0.06)_0%,transparent_70%)]" />
      <div className="relative z-10 reveal">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.9]">
          TU CLUB SE<br />
          <span className="[-webkit-text-stroke:1px_rgba(239,237,231,0.22)] text-transparent">MERECE</span><br />
          TECNOLOGÍA<br />
          <span className="text-[#C8F73A]">PROFESIONAL</span>
        </h2>
        <p className="text-[0.88rem] text-[#8E9090] font-light mt-7 mb-10 leading-[1.6]">
          Solicitá una demo gratuita y en 48 horas te mostramos cómo funciona<br className="hidden md:block" /> en un club igual al tuyo. Sin compromiso de contratación.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button className="bg-[#C8F73A] text-[#07090D] hover:bg-[#C8F73A]/90 text-[0.9rem] tracking-[0.08em] uppercase font-medium px-8 h-14 hover:-translate-y-[3px] hover:shadow-[0_10px_32px_rgba(200,247,58,0.22)] transition-all">
              Solicitar demo gratuita →
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-[rgba(239,237,231,0.13)] text-[#EFEDE7] hover:border-[rgba(239,237,231,0.28)] text-[0.9rem] tracking-[0.08em] uppercase font-light px-8 h-14 bg-transparent transition-colors">
              Hablar con un asesor
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
