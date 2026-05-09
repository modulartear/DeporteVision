"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#value", label: "Para tu club" },
    { href: "/#demo", label: "Análisis" },
    { href: "/#gallery", label: "Deportes" },
    { href: "/#pricing", label: "Planes" },
    { href: "/#contact", label: "Contacto" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] px-6 md:px-12 py-4 flex items-center justify-between bg-gradient-to-b from-[#07090D]/97 to-transparent backdrop-blur-[3px]">
      <Link href="/" className="font-[family-name:var(--font-display)] text-2xl md:text-[1.7rem] tracking-[0.06em] text-[#EFEDE7]">
        Deporte<span className="text-[#C8F73A]">Vision</span>
      </Link>

      <ul className="hidden md:flex items-center gap-9">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-[0.72rem] tracking-[0.13em] uppercase text-[#8E9090] hover:text-[#EFEDE7] transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#C8F73A] text-[#07090D] text-xs">
                    {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-[#EFEDE7]">{user.displayName || "Usuario"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#0F1217] border-[rgba(239,237,231,0.13)]">
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer text-[#EFEDE7]">
                  <User className="mr-2 h-4 w-4" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[rgba(239,237,231,0.07)]" />
              <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-[#FF5F5F] focus:text-[#FF5F5F]">
                <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost" className="text-[0.72rem] tracking-[0.1em] uppercase text-[#8E9090] hover:text-[#EFEDE7]">Iniciar sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#C8F73A] text-[#07090D] hover:bg-[#C8F73A]/90 text-[0.72rem] tracking-[0.1em] uppercase font-medium px-5 py-2.5 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(200,247,58,0.2)] transition-all">
                Solicitar demo →
              </Button>
            </Link>
          </>
        )}
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-[#EFEDE7]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div className={cn("md:hidden fixed top-16 left-0 right-0 bg-[#07090D]/98 backdrop-blur-md overflow-hidden transition-all duration-300 border-b border-[rgba(239,237,231,0.07)]", mobileMenuOpen ? "max-h-80" : "max-h-0")}>
        <div className="px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block text-sm tracking-[0.1em] uppercase text-[#8E9090] hover:text-[#EFEDE7] py-2" onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[rgba(239,237,231,0.07)] flex gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#C8F73A] text-[#07090D] text-xs tracking-[0.1em] uppercase">Dashboard</Button>
                </Link>
                <Button variant="outline" className="flex-1 border-[rgba(239,237,231,0.07)] text-[#FF5F5F] text-xs" onClick={() => { signOut(); setMobileMenuOpen(false); }}>Cerrar sesión</Button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-[#8E9090] text-xs tracking-[0.1em] uppercase">Iniciar sesión</Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#C8F73A] text-[#07090D] text-xs tracking-[0.1em] uppercase">Solicitar demo</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
