"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordMinLength = password.length >= 6;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await signUp(name.trim(), email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al registrarse";
      if (message.includes("auth/email-already-in-use")) {
        setError("Ya existe una cuenta con este email. ¿Querés iniciar sesión?");
      } else if (message.includes("auth/weak-password")) {
        setError("La contraseña es muy débil. Usá al menos 6 caracteres.");
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#080A0E] px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-wider">
          Deporte<span className="text-[#C8F73A]">Vision</span>
        </Link>
      </div>

      <Card className="w-full max-w-md bg-[#111318] border-[rgba(240,238,232,0.08)] text-[#F0EEE8]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-[family-name:var(--font-display)] tracking-[0.05em] text-[#F0EEE8]">
            CREAR CUENTA
          </CardTitle>
          <p className="text-sm text-[#9B9D9A] font-light">
            Registrate para empezar a analizar tus partidos
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
              <Label htmlFor="name" className="text-[#9B9D9A] text-xs tracking-[0.1em] uppercase">Nombre</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                disabled={loading}
                className="bg-[#191C23] border-[rgba(240,238,232,0.08)] text-[#F0EEE8] placeholder:text-[#9B9D9A]/50 focus:border-[#C8F73A] focus:ring-[#C8F73A]"
              />
            </div>

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
              <Label htmlFor="password" className="text-[#9B9D9A] text-xs tracking-[0.1em] uppercase">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
              {password.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${passwordMinLength ? "text-[#C8F73A]" : "text-[#9B9D9A]/40"}`}
                  />
                  <span className={passwordMinLength ? "text-[#C8F73A]" : "text-[#9B9D9A]"}>
                    Al menos 6 caracteres
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#9B9D9A] text-xs tracking-[0.1em] uppercase">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Repetí tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={loading}
                className="bg-[#191C23] border-[rgba(240,238,232,0.08)] text-[#F0EEE8] placeholder:text-[#9B9D9A]/50 focus:border-[#C8F73A] focus:ring-[#C8F73A]"
              />
              {confirmPassword.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${passwordsMatch ? "text-[#C8F73A]" : "text-[#FF5F5F]"}`}
                  />
                  <span className={passwordsMatch ? "text-[#C8F73A]" : "text-[#FF5F5F]"}>
                    {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                  </span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#C8F73A] text-[#080A0E] hover:bg-[#C8F73A]/90 text-[0.85rem] tracking-[0.08em] uppercase font-medium h-11"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta"
              )}
            </Button>

            <p className="text-xs text-[#9B9D9A] text-center">
              Al registrarte, aceptás nuestros{" "}
              <span className="underline cursor-pointer hover:text-[#F0EEE8]">Términos de servicio</span> y{" "}
              <span className="underline cursor-pointer hover:text-[#F0EEE8]">Política de privacidad</span>.
            </p>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-[#9B9D9A]">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-[#C8F73A] font-medium hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
