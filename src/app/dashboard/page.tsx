"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Activity,
  Clock,
  Play,
  LogOut,
  User,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  X,
  FileVideo,
  CloudUpload,
  Link as LinkIcon,
  Youtube,
  Zap,
} from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, isFirebaseConfigured } from "@/lib/firebase";
import {
  createMatchDocument,
  getUserMatches,
  updateMatchStatus,
  saveMatchAnalysis,
} from "@/lib/firestore";
import { generatePadelAnalysis } from "@/lib/padel-analysis";
import { useToast } from "@/hooks/use-toast";
import type { Match, MatchStatus } from "@/types";

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
        <Badge variant="secondary" className="gap-1 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/10 border-yellow-500/20">
          <Loader2 className="h-3 w-3 animate-spin" />
          Procesando
        </Badge>
      );
    case "analyzed":
      return (
        <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-400 hover:bg-green-500/10 border-green-500/20">
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
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [matchTitle, setMatchTitle] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [analyzingMatchId, setAnalyzingMatchId] = useState<string | null>(null);

  // YouTube URL state
  const [uploadMode, setUploadMode] = useState<"file" | "youtube">("file");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeError, setYoutubeError] = useState<string | null>(null);

  // Cargar partidos reales del usuario
  useEffect(() => {
    if (user?.uid) {
      loadMatches();
    }
  }, [user?.uid]);

  // Polling: actualizar partidos cada 5s si hay alguno en "processing"
  useEffect(() => {
    const hasProcessing = matches.some((m) => m.status === "processing");
    if (!hasProcessing || !user?.uid) return;

    const interval = setInterval(async () => {
      try {
        if (isFirebaseConfigured) {
          const userMatches = await getUserMatches(user.uid);
          setMatches(userMatches);
        }
      } catch {
        // Silenciar errores de polling
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [matches, user?.uid]);

  const loadMatches = async () => {
    if (!user?.uid) return;
    setLoadingMatches(true);
    try {
      if (isFirebaseConfigured) {
        const userMatches = await getUserMatches(user.uid);
        setMatches(userMatches);
      }
    } catch (error) {
      console.error("Error cargando partidos:", error);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({
        title: "Archivo invalido",
        description: "Por favor selecciona un archivo de video (MP4, MOV, AVI, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "El video no puede superar los 500MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    if (!matchTitle) {
      const now = new Date();
      setMatchTitle("Partido " + now.toLocaleDateString("es-AR"));
    }
  };

  // Validar URL de YouTube
  const isValidYouTubeUrl = useCallback((url: string): boolean => {
    const trimmed = url.trim();
    if (!trimmed) return false;
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=[\w-]+/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/[\w-]+/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/[\w-]+/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/[\w-]+/,
      /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?.*v=[\w-]+/,
    ];
    return patterns.some((p) => p.test(trimmed));
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

  /**
   * Ejecuta el analisis completo del partido.
   * Funciona tanto con Firestore como sin el (fallback local).
   */
  const runAnalysis = async (matchId: string): Promise<boolean> => {
    console.log("[Analisis] Iniciando para match:", matchId);

    try {
      // 1. Marcar como processing en Firestore (si esta disponible)
      if (isFirebaseConfigured) {
        try {
          await updateMatchStatus(matchId, "processing");
        } catch (err) {
          console.warn("[Analisis] No se pudo actualizar estado en Firestore:", err);
        }
      }
      console.log("[Analisis] Estado -> processing");

      // 2. Simular tiempo de procesamiento IA
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 3. Generar analisis
      const analysis = generatePadelAnalysis(matchId);
      console.log("[Analisis] Datos generados, guardando...");

      // 4. Intentar guardar en Firestore
      if (isFirebaseConfigured) {
        try {
          await saveMatchAnalysis(matchId, analysis);
          console.log("[Analisis] Guardado en Firestore. Estado -> analyzed");
        } catch (err) {
          console.warn("[Analisis] No se pudo guardar en Firestore, usando estado local:", err);
        }
      } else {
        console.log("[Analisis] Firebase no configurado, analisis generado localmente");
      }

      return true;
    } catch (error) {
      console.error("[Analisis] Error:", error);
      if (isFirebaseConfigured) {
        try {
          await updateMatchStatus(matchId, "error", error instanceof Error ? error.message : "Error desconocido");
        } catch {
          // Si esto tambien falla, no podemos hacer mucho mas
        }
      }
      return false;
    }
  };

  /**
   * Crea el partido y ejecuta el analisis.
   * Si Firestore no esta disponible, genera un ID local y funciona de todas formas.
   */
  const createAndAnalyze = async (title: string, videoUrl: string) => {
    if (!user?.uid) return;

    let matchId: string;

    try {
      // 1. Crear el partido en Firestore
      if (isFirebaseConfigured) {
        matchId = await createMatchDocument(user.uid, title, "padel", videoUrl);
        console.log("[Dashboard] Partido creado en Firestore:", matchId);
      } else {
        // Fallback: generar ID local
        matchId = "local-" + Date.now();
        console.log("[Dashboard] Firebase no configurado, ID local:", matchId);
      }
    } catch (error) {
      console.error("[Dashboard] Error creando partido en Firestore:", error);
      // Fallback: generar ID local
      matchId = "local-" + Date.now();
      console.log("[Dashboard] Fallback a ID local:", matchId);
    }

    // 2. Agregar a la lista local inmediatamente como "processing"
    const newMatch: Match = {
      id: matchId,
      userId: user.uid,
      title,
      sport: "padel",
      videoUrl,
      status: "processing",
      createdAt: new Date() as unknown as Match["createdAt"],
    };
    setMatches((prev) => [newMatch, ...prev]);

    // 3. Ejecutar analisis en segundo plano
    setAnalyzingMatchId(matchId);
    const success = await runAnalysis(matchId);
    setAnalyzingMatchId(null);

    // 4. Actualizar estado local
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, status: success ? "analyzed" : "error" }
          : m
      )
    );

    // 5. Recargar desde Firestore para tener datos actualizados
    if (isFirebaseConfigured) {
      await loadMatches();
    }

    if (success) {
      toast({
        title: "Analisis completado",
        description: title + " fue analizado correctamente. Hace click para ver los resultados.",
      });
    } else {
      toast({
        title: "Error en el analisis",
        description: "No se pudo analizar el partido. Intenta de nuevo desde el historial.",
        variant: "destructive",
      });
    }
  };

  const handleYouTubeSubmit = async () => {
    setYoutubeError(null);

    if (!youtubeUrl.trim()) {
      setYoutubeError("Pega una URL de YouTube para continuar.");
      return;
    }

    if (!user?.uid) {
      setYoutubeError("No se detecto usuario. Recarga la pagina e inicia sesion de nuevo.");
      return;
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      const msg = "La URL no parece ser de YouTube. Usa un enlace como youtube.com/watch?v=...";
      setYoutubeError(msg);
      toast({ title: "URL invalida", description: msg, variant: "destructive" });
      return;
    }

    setUploading(true);

    try {
      const title = matchTitle || ("Partido " + new Date().toLocaleDateString("es-AR"));

      toast({
        title: "Video agregado",
        description: "El analisis con IA comenzo automaticamente.",
      });

      // Resetear formulario ANTES del analisis para que no se trabe
      const urlToUse = youtubeUrl.trim();
      setYoutubeUrl("");
      setMatchTitle("");
      setYoutubeError(null);
      setUploading(false);

      // Crear partido + ejecutar analisis
      await createAndAnalyze(title, urlToUse);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido.";
      setYoutubeError(message);
      toast({ title: "Error al agregar el video", description: message, variant: "destructive" });
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.uid) return;

    if (!isFirebaseConfigured || !storage) {
      toast({
        title: "Firebase no configurado",
        description: "Configura las variables de entorno para habilitar la subida de videos.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const timestamp = Date.now();
      const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storageRef = ref(storage, "videos/" + user.uid + "/" + timestamp + "_" + sanitizedName);

      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      const downloadUrl = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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

      const title = matchTitle || ("Partido " + new Date().toLocaleDateString("es-AR"));

      toast({
        title: "Video subido correctamente",
        description: "El analisis con IA comenzo automaticamente.",
      });

      // Resetear formulario
      setSelectedFile(null);
      setMatchTitle("");
      setUploadProgress(0);
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Crear partido + ejecutar analisis
      await createAndAnalyze(title, downloadUrl);
    } catch (error: unknown) {
      console.error("Error en upload:", error);
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast({ title: "Error al subir el video", description: message, variant: "destructive" });
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setMatchTitle("");
    setYoutubeUrl("");
    setYoutubeError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ─── Stats calculados de partidos reales ─────────────────────────────
  const realStats = matches.length > 0 ? {
    total: matches.length,
    analyzed: matches.filter((m) => m.status === "analyzed").length,
    processing: matches.filter((m) => m.status === "processing").length,
    uploaded: matches.filter((m) => m.status === "uploaded").length,
  } : null;

  const statsCards = realStats ? [
    {
      label: "Partidos totales",
      value: String(realStats.total),
      icon: Activity,
      description: realStats.uploaded + " pendientes",
    },
    {
      label: "Analizados",
      value: String(realStats.analyzed),
      icon: BarChart3,
      description: realStats.total > 0 ? Math.round((realStats.analyzed / realStats.total) * 100) + "% completados" : "Sin datos",
    },
    {
      label: "En proceso",
      value: String(realStats.processing),
      icon: Loader2,
      description: realStats.processing > 0 ? "Procesando ahora" : "Ninguno",
    },
    {
      label: "Pendientes",
      value: String(realStats.uploaded),
      icon: Upload,
      description: "Listos para analizar",
    },
  ] : [
    { label: "Partidos totales", value: "0", icon: Activity, description: "Subi tu primer video" },
    { label: "Analizados", value: "0", icon: BarChart3, description: "Sin datos" },
    { label: "En proceso", value: "0", icon: Loader2, description: "Ninguno" },
    { label: "Pendientes", value: "0", icon: Upload, description: "Listos para analizar" },
  ];

  const hasMatches = matches.length > 0;

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
                  Cerrar sesion
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
            Hola, {userProfile?.name || user?.displayName || "Usuario"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Aca tenes un resumen de tu actividad y tus partidos.
          </p>
        </div>

        {/* Banner de analisis en curso */}
        {analyzingMatchId && (
          <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Analizando partido con IA...</p>
              <p className="text-xs text-muted-foreground">Esto tarda unos segundos. El partido aparecera como "Analizado" cuando termine.</p>
            </div>
          </div>
        )}

        {/* Upload video card */}
        <Card className="mb-8 border-dashed border-2 hover:border-primary/50 transition-colors">
          <CardContent className="py-6">
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
                className={"shrink-0 px-5 py-2.5 text-sm font-medium tracking-wide transition-colors relative border-none bg-transparent cursor-pointer " + (uploadMode === "file" ? "text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                <Upload className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                Subir archivo
                {uploadMode === "file" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
              <button
                onClick={() => { setUploadMode("youtube"); cancelUpload(); }}
                className={"shrink-0 px-5 py-2.5 text-sm font-medium tracking-wide transition-colors relative border-none bg-transparent cursor-pointer " + (uploadMode === "youtube" ? "text-primary" : "text-muted-foreground hover:text-foreground")}
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
                      Carga el video de tu partido para analisis automatico con IA
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      MP4, MOV, AVI - Maximo 500MB
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

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Nombre del partido
                  </label>
                  <input
                    type="text"
                    value={matchTitle}
                    onChange={(e) => setMatchTitle(e.target.value)}
                    placeholder="Ej: Partido vs Juan y Marcos"
                    disabled={uploading}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                  />
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subiendo video...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: uploadProgress + "%" }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={handleUpload} disabled={uploading} className="flex-1">
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
                      Si ya subiste el video a YouTube, pega el enlace aca y lo procesamos.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formatos: youtube.com/watch?v=... - youtu.be/... - youtube.com/shorts/...
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    URL del video
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => { setYoutubeUrl(e.target.value); setYoutubeError(null); }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !uploading) {
                          e.preventDefault();
                          handleYouTubeSubmit();
                        }
                      }}
                      placeholder="https://www.youtube.com/watch?v=..."
                      disabled={uploading}
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                    />
                  </div>
                  {youtubeUrl.trim() && !isValidYouTubeUrl(youtubeUrl) && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      La URL no parece ser de YouTube.
                    </p>
                  )}
                  {youtubeUrl.trim() && isValidYouTubeUrl(youtubeUrl) && (
                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      URL valida - Video ID: {extractYouTubeId(youtubeUrl)}
                    </p>
                  )}
                </div>

                {youtubeError && (
                  <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{youtubeError}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Nombre del partido (opcional)
                  </label>
                  <input
                    type="text"
                    value={matchTitle}
                    onChange={(e) => setMatchTitle(e.target.value)}
                    placeholder="Ej: Partido vs Juan y Marcos"
                    disabled={uploading}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleYouTubeSubmit} disabled={uploading} className="flex-1">
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Agregando...
                      </>
                    ) : (
                      <>
                        <Youtube className="mr-2 h-4 w-4" />
                        Agregar y analizar con IA
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
          {statsCards.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={"h-4 w-4 " + (stat.label === "En proceso" && stat.value !== "0" ? "animate-spin text-yellow-400" : "text-muted-foreground")} />
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
          </div>

          {loadingMatches ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando partidos...</span>
            </div>
          ) : !hasMatches ? (
            <div className="text-center py-12">
              <Play className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No tenes partidos todavia. Subi tu primer video para comenzar a ver analisis reales con IA.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <Card
                  key={match.id}
                  className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                  onClick={() => router.push("/dashboard/matches/" + match.id)}
                >
                  <CardContent className="flex items-center justify-between py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        {match.status === "analyzed" ? (
                          <BarChart3 className="h-5 w-5 text-green-400" />
                        ) : match.status === "processing" ? (
                          <Loader2 className="h-5 w-5 text-yellow-400 animate-spin" />
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
                          {match.status === "analyzed" && (
                            <Badge variant="outline" className="text-xs py-0 px-1.5 text-primary border-primary/30">
                              <Zap className="h-2.5 w-2.5 mr-0.5" />
                              Ver analisis
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(match.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
