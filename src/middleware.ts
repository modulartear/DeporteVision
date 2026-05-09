import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard"];

// Rutas accesibles solo para usuarios NO autenticados
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Leer cookie de sesión de Firebase (se establece desde el cliente)
  const sessionCookie = request.cookies.get("__session")?.value;
  const isAuthenticated = !!sessionCookie;

  // Redirigir usuarios no autenticados que intentan acceder a rutas protegidas
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirigir usuarios autenticados que intentan acceder a rutas de auth
  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
