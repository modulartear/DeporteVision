"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push(redirect);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      if (message.includes("auth/invalid-credential") || message.includes("auth/wrong-password")) {
        setError("Email o contraseña incorrectos. Verificá tus datos e intentá de nuevo.");
      } else if (message.includes("auth/user-not-found")) {
        setError("No existe una cuenta con este email. ¿Necesitás registrarte?");
      } else if (message.includes("auth/too-many-requests")) {
        setError("Demasiados intentos. Esperá unos minutos e intentá de nuevo.");
      } else if (message.includes("auth/invalid-email")) {
        setError("El formato del email no es válido.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-[#111318] border-[rgba(240,238,232,0.08)] text-[#F0EEE8]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-[family-name:var(--font-display)] tracking-[0.05em] text-[#F0EEE8]">
          INICIAR SESIÓN
        </CardTitle>
        <p className="text-sm text-[#9B9D9A] font-light">
          Accedé a tu dashboard de análisis deportivo
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-[#FF5F5F]/10 border-[#FF5F5F]/30 text-[#FF5F5F]">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#9B9D9A] text-xs tracking-[0.1em] uppercase">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
              className="bg-[#191C23] border-[rgba(240,238,232,0.08)] text-[#F0EEE8] placeholder:text-[#9B9D9A]/50 focus:border-[#C8F73A] focus:ring-[#C8F73A]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[#9B9D9A] text-xs tracking-[0.1em] uppercase">Contraseña</Label>
              <Link
                href="#"
                className="text-xs text-[#9B9D9A] hover:text-[#C8F73A] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                className="pr-10 bg-[#191C23] border-[rgba(240,238,232,0.08)] text-[#F0EEE8] placeholder:text-[#9B9D9A]/50 focus:border-[#C8F73A] focus:ring-[#C8F73A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9D9A] hover:text-[#F0EEE8] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#C8F73A] text-[#080A0E] hover:bg-[#C8F73A]/90 text-[0.85rem] tracking-[0.08em] uppercase font-medium h-11"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-[#9B9D9A]">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-[#C8F73A] font-medium hover:underline">
            Registrate acá
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#080A0E] px-4">
      <div className="mb-8">
        <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-wider">
          Deporte<span className="text-[#C8F73A]">Vision</span>
        </Link>
      </div>

      <Suspense fallback={<div className="text-sm text-[#9B9D9A]">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
