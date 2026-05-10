"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

/**
 * Componente que sincroniza el estado de autenticación de Firebase
 * con una cookie accesible desde el middleware de Next.js.
 * Esto permite que el middleware proteja rutas del lado del servidor.
 */
export function AuthSync() {
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Obtener el ID token y establecerlo como cookie
        const token = await user.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax`;
      } else {
        // Eliminar la cookie si no hay usuario
        document.cookie = `__session=; path=/; max-age=0; SameSite=Lax`;
      }
    });

    // Refrescar el token cada 10 minutos
    const interval = setInterval(async () => {
      if (!auth?.currentUser) return;
      const token = await auth.currentUser.getIdToken(true);
      document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax`;
    }, 10 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return null;
}
