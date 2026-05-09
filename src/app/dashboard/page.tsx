"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
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
  X,
  FileVideo,
  CloudUpload,
  Link as LinkIcon,
  Youtube,
} from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, isFirebaseConfigured } from "@/lib/firebase";
import { createMatchDocument, getUserMatches } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import type { Match, MatchStatus } from "@/types";

// ─── Datos placeholder para cuando no hay partidos reales ─────────
const placeholderMatches = [
  {
    id: "demo-1",
    title: "Partido vs Juan & Marcos",
    sport: "padel" as const,
    status: "analyzed" as MatchStatus,
    createdAt: null as unknown as Match["createdAt"],
  },
  {
    id: "demo-2",
    title: "Partido vs Equipo Rojo",
    sport: "padel" as const,
    status: "processing" as MatchStatus,
    createdAt: null as unknown as Match["createdAt"],
  },
  {
    id: "demo-3",
    title: "Partido vs Luis & Pedro",
    sport: "padel" as const,
    status: "uploaded" as MatchStatus,
    createdAt: null as unknown as Match["createdAt"],
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
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [matchTitle, setMatchTitle] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // YouTube URL state
  const [uploadMode, setUploadMode] = useState<"file" | "youtube">("file");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Cargar partidos reales del usuario
  useEffect(() => {
    if (user?.uid && isFirebaseConfigured) {
      loadMatches();
    }
  }, [user?.uid]);

  const loadMatches = async () => {
    if (!user?.uid) return;
    setLoadingMatches(true);
    try {
      const userMatches = await getUserMatches(user.uid);
      setMatches(userMatches);
    } catch (error) {
      console.error("Error cargando partidos:", error);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Archivo inválido",
        description: "Por favor seleccioná un archivo de video (MP4, MOV, AVI, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (máximo 500MB)
    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "El video no puede superar los 500MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    // Auto-generar título si está vacío
    if (!matchTitle) {
      const now = new Date();
      setMatchTitle(`Partido ${now.toLocaleDateString("es-AR")}`);
    }
  };

  // Validar URL de YouTube
  const isValidYouTubeUrl = useCallback((url: string): boolean => {
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
    ];
    return patterns.some((p) => p.test(url.trim()));
  }, []);

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([\w-]+)/,
      /(?:youtube\.com\/embed\/)([\w-]+)/,
      /(?:youtu\.be\/)([\w-]+)/,
      /(?:youtube\.com\/shorts\/)([\w-]+)/,
    ];
    for (const p of patterns) {
      const match = url.match(p);
      if (match) return match[1];
    }
    return null;
  };

  const handleYouTubeSubmit = async () => {
    if (!youtubeUrl.trim() || !user?.uid) return;

    if (!isFirebaseConfigured) {
      toast({
        title: "Firebase no configurado",
        description: "Configurá las variables de entorno para habilitar esta función.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      toast({
        title: "URL inválida",
        description: "Pegá una URL válida de YouTube (youtube.com/watch?v=... o youtu.be/...)",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const title = matchTitle || `Partido ${new Date().toLocaleDateString("es-AR")}`;
      await createMatchDocument(user.uid, title, "padel", youtubeUrl.trim());

      toast({
        title: "Video de YouTube agregado",
        description: `"${title}" se agregó correctamente y está listo para procesar.`,
      });

      // Resetear estado
      setYoutubeUrl("");
      setMatchTitle("");

      // Recargar partidos
      await loadMatches();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast({
        title: "Error al agregar el video",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.uid) return;

    if (!isFirebaseConfigured || !storage) {
      toast({
        title: "Firebase no configurado",
        description: "Configurá las variables de entorno para habilitar la subida de videos.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Crear referencia en Firebase Storage
      const timestamp = Date.now();
      const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storageRef = ref(storage, `videos/${user.uid}/${timestamp}_${sanitizedName}`);

      // Subir con progreso
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      const downloadUrl = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Error subiendo video:", error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      // Crear documento del partido en Firestore
      const title = matchTitle || `Partido ${new Date().toLocaleDateString("es-AR")}`;
      await createMatchDocument(user.uid, title, "padel", downloadUrl);

      toast({
        title: "Video subido correctamente",
        description: `"${title}" se subió y está listo para procesar.`,
      });

      // Resetear estado
      setSelectedFile(null);
      setMatchTitle("");
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Recargar partidos
      await loadMatches();
    } catch (error: unknown) {
      console.error("Error en upload:", error);
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast({
        title: "Error al subir el video",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setMatchTitle("");
    setYoutubeUrl("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayMatches = matches.length > 0 ? matches : placeholderMatches;
  const isUsingPlaceholders = matches.length === 0;

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
          <CardContent className="py-6">
            {/* Input oculto para seleccionar archivo */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Tabs: Archivo / YouTube */}
            <div className="flex gap-0 border-b border-border mb-5">
              <button
                onClick={() => { setUploadMode("file"); cancelUpload(); }}
                className={`shrink-0 px-5 py-2.5 text-sm font-medium tracking-wide transition-colors relative border-none bg-transparent cursor-pointer ${
                  uploadMode === "file" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Upload className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                Subir archivo
                {uploadMode === "file" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
              <button
                onClick={() => { setUploadMode("youtube"); cancelUpload(); }}
                className={`shrink-0 px-5 py-2.5 text-sm font-medium tracking-wide transition-colors relative border-none bg-transparent cursor-pointer ${
                  uploadMode === "youtube" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Youtube className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                URL de YouTube
                {uploadMode === "youtube" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            </div>

            {/* ── Tab: Subir archivo ── */}
            {uploadMode === "file" && !selectedFile && (
              <div
                className="flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CloudUpload className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Subir video desde tu dispositivo</h3>
                    <p className="text-sm text-muted-foreground">
                      Cargá el video de tu partido para análisis automático con IA
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      MP4, MOV, AVI · Máximo 500MB
                    </p>
                  </div>
                </div>
                <Button className="shrink-0" disabled={uploading}>
                  <Upload className="mr-2 h-4 w-4" />
                  Seleccionar video
                </Button>
              </div>
            )}

            {uploadMode === "file" && selectedFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileVideo className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  {!uploading && (
                    <Button variant="ghost" size="icon" onClick={cancelUpload} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Campo de título */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Nombre del partido
                  </label>
                  <input
                    type="text"
                    value={matchTitle}
                    onChange={(e) => setMatchTitle(e.target.value)}
                    placeholder="Ej: Partido vs Juan & Marcos"
                    disabled={uploading}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                  />
                </div>

                {/* Barra de progreso */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subiendo video...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subiendo... {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <CloudUpload className="mr-2 h-4 w-4" />
                        Subir y analizar
                      </>
                    )}
                  </Button>
                  {!uploading && (
                    <Button variant="outline" onClick={cancelUpload}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* ── Tab: YouTube URL ── */}
            {uploadMode === "youtube" && (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 shrink-0">
                    <Youtube className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Agregar video de YouTube</h3>
                    <p className="text-sm text-muted-foreground">
                      Si ya subiste el video a YouTube, pegá el enlace acá y lo procesamos desde ahí.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formatos: youtube.com/watch?v=... · youtu.be/... · youtube.com/shorts/...
                    </p>
                  </div>
                </div>

                {/* Campo de URL */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    URL del video
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      disabled={uploading}
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                    />
                  </div>
                  {youtubeUrl.trim() && !isValidYouTubeUrl(youtubeUrl) && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      URL de YouTube no válida. Verificá el formato.
                    </p>
                  )}
                  {youtubeUrl.trim() && isValidYouTubeUrl(youtubeUrl) && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      URL válida — Video ID: {extractYouTubeId(youtubeUrl)}
                    </p>
                  )}
                </div>

                {/* Campo de título */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Nombre del partido
                  </label>
                  <input
                    type="text"
                    value={matchTitle}
                    onChange={(e) => setMatchTitle(e.target.value)}
                    placeholder="Ej: Partido vs Juan & Marcos"
                    disabled={uploading}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleYouTubeSubmit}
                    disabled={uploading || !youtubeUrl.trim() || !isValidYouTubeUrl(youtubeUrl)}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Agregando...
                      </>
                    ) : (
                      <>
                        <Youtube className="mr-2 h-4 w-4" />
                        Agregar video de YouTube
                      </>
                    )}
                  </Button>
                  {!uploading && (
                    <Button variant="outline" onClick={cancelUpload}>
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>
            )}
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

          {loadingMatches ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando partidos...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {displayMatches.map((match) => (
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
                            {match.createdAt
                              ? new Date(match.createdAt as unknown as number).toLocaleDateString("es-AR")
                              : "Reciente"}
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
          )}

          {/* Empty state hint */}
          {isUsingPlaceholders && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Estos son datos de ejemplo. Subí tu primer video para comenzar a ver análisis reales.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
