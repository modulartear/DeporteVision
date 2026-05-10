"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * Muestra un aviso cuando Firebase no está configurado.
 * Útil durante el desarrollo para recordar configurar las credenciales.
 */
export function FirebaseConfigWarning() {
  const { isFirebaseConfigured } = useAuth();

  if (isFirebaseConfigured) return null;

  return (
    <Alert variant="destructive" className="max-w-2xl mx-auto mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Firebase no configurado</AlertTitle>
      <AlertDescription>
        Para habilitar la autenticación, configurá las variables de entorno en{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">.env.local</code>{" "}
        con tus credenciales de Firebase. La app funciona en modo demo sin autenticación.
      </AlertDescription>
    </Alert>
  );
}
