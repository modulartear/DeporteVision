"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  BarChart3,
  Video,
  Zap,
  TrendingUp,
  Users,
  Play,
  ArrowRight,
  CheckCircle2,
  Target,
  Activity,
  Layers,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
            <Zap className="mr-1.5 h-3.5 w-3.5" />
            Impulsado por Inteligencia Artificial
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Analiza tus partidos de{" "}
            <span className="text-primary">pádel</span> con IA
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Sube el video de tu partido y obtén estadísticas avanzadas, análisis tácticos y
            recomendaciones personalizadas en minutos. Toma decisiones basadas en datos reales.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 h-12">
                Comenzar gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-base px-8 h-12">
                <Play className="mr-2 h-4 w-4" />
                Ver demo
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Sin tarjeta de crédito requerida. Plan gratuito disponible.
          </p>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: Video,
      title: "Sube tu video",
      description:
        "Carga el video de tu partido de pádel en cualquier formato. Nuestro sistema procesa automáticamente la grabación para extraer cada punto, jugada y movimiento relevante del encuentro.",
    },
    {
      icon: Eye,
      title: "Análisis automático con IA",
      description:
        "Nuestros modelos de inteligencia artificial detectan patrones de juego, tipos de golpes, posicionamiento en cancha y secuencias tácticas sin intervención manual.",
    },
    {
      icon: BarChart3,
      title: "Estadísticas avanzadas",
      description:
        "Obtén métricas detalladas: porcentaje de saque, devolución, errores no forzados, winners, puntos ganados en red y más. Visualiza tu rendimiento en gráficos claros e interactivos.",
    },
    {
      icon: TrendingUp,
      title: "Evolución del rendimiento",
      description:
        "Rastrea tu progreso partido a partido. Compara estadísticas entre encuentros, identifica mejoras y detecta áreas donde necesitas enfocar tu entrenamiento.",
    },
    {
      icon: Target,
      title: "Recomendaciones tácticas",
      description:
        "La IA genera sugerencias personalizadas basadas en tus patrones de juego: cuándo subir a la red, cómo mejorar el saque, qué tipo de globos usar según tu rival.",
    },
    {
      icon: Users,
      title: "Perfil de equipo",
      description:
        "Gestiona tu perfil y el de tu compañero de dupla. Comparte informes de análisis y coordinen estrategias basadas en datos objetivos de sus partidos anteriores.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Características
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Todo lo que necesitas para mejorar tu juego
          </h2>
          <p className="text-muted-foreground">
            DeporteVision AI combina visión computacional y análisis de datos para darte una
            ventaja competitiva real en la cancha.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-2 hover:border-primary/50 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DashboardPreviewSection() {
  return (
    <section id="preview" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Vista previa
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Tu dashboard de análisis
          </h2>
          <p className="text-muted-foreground">
            Visualiza todas tus métricas y partidos desde un panel intuitivo diseñado para
            deportistas y entrenadores.
          </p>
        </div>

        {/* Simulated dashboard preview */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl border-2 bg-card shadow-xl overflow-hidden">
            {/* Dashboard header bar */}
            <div className="bg-muted/50 border-b px-6 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground">
                  dashboard.deportevision.ai
                </span>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6 md:p-8">
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Partidos analizados", value: "12", icon: Activity },
                  { label: "Win rate", value: "67%", icon: TrendingUp },
                  { label: "Errores no forzados", value: "8.3", icon: Target },
                  { label: "Puntos en red", value: "73%", icon: Layers },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border bg-background p-4 text-center"
                  >
                    <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Placeholder chart area */}
              <div className="rounded-lg border bg-muted/30 p-8 md:p-12 flex flex-col items-center justify-center min-h-[200px]">
                <BarChart3 className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Gráfico de rendimiento por partido
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Visualización interactiva con datos reales
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  const plans = [
    {
      name: "Gratuito",
      price: "$0",
      period: "/mes",
      description: "Perfecto para empezar a analizar tus primeros partidos",
      features: [
        "3 partidos por mes",
        "Estadísticas básicas",
        "Historial de 30 días",
        "Soporte por email",
      ],
      cta: "Comenzar gratis",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/mes",
      description: "Para jugadores y entrenadores que quieren análisis avanzados",
      features: [
        "Partidos ilimitados",
        "Análisis táctico completo",
        "Recomendaciones IA",
        "Historial sin límite",
        "Exportar reportes PDF",
        "Perfil de dupla",
      ],
      cta: "Comenzar prueba gratis",
      highlighted: true,
    },
    {
      name: "Premium",
      price: "$49",
      period: "/mes",
      description: "Para academias y clubes que gestionan múltiples jugadores",
      features: [
        "Todo lo de Pro",
        "Hasta 10 jugadores",
        "Dashboard del equipo",
        "API de integración",
        "Soporte prioritario",
        "Branding personalizado",
      ],
      cta: "Contactar ventas",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Precios
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Un plan para cada nivel
          </h2>
          <p className="text-muted-foreground">
            Comienza gratis y escala cuando estés listo. Sin sorpresas ni costos ocultos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden ${
                plan.highlighted ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Popular
                </div>
              )}
              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center rounded-2xl bg-primary p-12 md:p-16 text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Listo para mejorar tu pádel?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Únete a cientos de jugadores que ya usan DeporteVision AI para entrenar más
            inteligentemente. Tu primer partido es gratis.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8 h-12"
            >
              Crear cuenta gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
