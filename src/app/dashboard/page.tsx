"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Eye,
  Upload,
  BarChart3,
  TrendingUp,
  Activity,
  Clock,
  Play,
  MoreVertical,
  LogOut,
  User,
  Video,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { MatchStatus } from "@/types";

// ─── Datos placeholder para el dashboard ─────────────────────────────
const placeholderMatches = [
  {
    id: "1",
    title: "Partido vs Juan & Marcos",
    sport: "padel" as const,
    status: "analyzed" as MatchStatus,
    createdAt: "Hace 2 días",
  },
  {
    id: "2",
    title: "Partido vs Equipo Rojo",
    sport: "padel" as const,
    status: "processing" as MatchStatus,
    createdAt: "Hace 5 horas",
  },
  {
    id: "3",
    title: "Partido vs Luis & Pedro",
    sport: "padel" as const,
    status: "uploaded" as MatchStatus,
    createdAt: "Hace 1 hora",
  },
  {
    id: "4",
    title: "Partido vs Ana & Carla",
    sport: "padel" as const,
    status: "error" as MatchStatus,
    createdAt: "Hace 3 días",
  },
];

const placeholderStats = [
  {
    label: "Partidos totales",
    value: "12",
    icon: Activity,
    description: "+3 este mes",
    trend: "up" as const,
  },
  {
    label: "Analizados",
    value: "8",
    icon: BarChart3,
    description: "66% completados",
    trend: "up" as const,
  },
  {
    label: "En proceso",
    value: "2",
    icon: Loader2,
    description: "Procesando ahora",
    trend: "neutral" as const,
  },
  {
    label: "Win rate",
    value: "67%",
    icon: TrendingUp,
    description: "+5% vs mes anterior",
    trend: "up" as const,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────
function getStatusBadge(status: MatchStatus) {
  switch (status) {
    case "uploaded":
      return (
        <Badge variant="secondary" className="gap-1">
          <Upload className="h-3 w-3" />
          Subido
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Loader2 className="h-3 w-3 animate-spin" />
          Procesando
        </Badge>
      );
    case "analyzed":
      return (
        <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3" />
          Analizado
        </Badge>
      );
    case "error":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Error
        </Badge>
      );
  }
}

// ─── Componente principal ─────────────────────────────────────────────
export default function DashboardPage() {
  const { user, userProfile, signOut } = useAuth();
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleUploadVideo = () => {
    setUploadingVideo(true);
    // Simulación de upload
    setTimeout(() => {
      setUploadingVideo(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Dashboard navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Eye className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              DeporteVision <span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.displayName?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">
                    {userProfile?.name || user?.displayName || "Usuario"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <p className="text-sm font-medium">
                    {userProfile?.name || user?.displayName || "Usuario"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className="mt-1.5 text-xs">
                    Plan {userProfile?.plan || "free"}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Mi perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Hola, {userProfile?.name || user?.displayName || "Usuario"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Acá tenés un resumen de tu actividad y tus partidos.
          </p>
        </div>

        {/* Upload video card */}
        <Card className="mb-8 border-dashed border-2 hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Subir nuevo video</h3>
                <p className="text-sm text-muted-foreground">
                  Cargá el video de tu partido para análisis automático con IA
                </p>
              </div>
            </div>
            <Button
              onClick={handleUploadVideo}
              disabled={uploadingVideo}
              className="shrink-0"
            >
              {uploadingVideo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {placeholderStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Match history */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Historial de partidos</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Ver todos
            </Button>
          </div>

          <div className="space-y-3">
            {placeholderMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {match.status === "analyzed" ? (
                        <BarChart3 className="h-5 w-5 text-green-600" />
                      ) : match.status === "processing" ? (
                        <Loader2 className="h-5 w-5 text-yellow-600 animate-spin" />
                      ) : match.status === "error" ? (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <Play className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{match.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {match.createdAt}
                        </span>
                        <Badge variant="outline" className="text-xs py-0 px-1.5">
                          {match.sport}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(match.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {match.status === "analyzed" && (
                          <DropdownMenuItem className="cursor-pointer">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Ver análisis
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty state hint */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Estos son datos de ejemplo. Subí tu primer video para comenzar a ver análisis reales.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
