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
    { href: "/#gallery", label: "Deportes" },
    { href: "/#videos", label: "En Vivo" },
    { href: "/#features", label: "Funciones" },
    { href: "/#pricing", label: "Precios" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between bg-gradient-to-b from-[#080A0E]/95 to-transparent backdrop-blur-sm">
      {/* Logo */}
      <Link href="/" className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-wider">
        Deporte<span className="text-[#C8F73A]">Vision</span>
      </Link>

      {/* Desktop Nav */}
      <ul className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[0.8rem] tracking-[0.12em] uppercase text-[#9B9D9A] hover:text-[#F0EEE8] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop CTA */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#C8F73A] text-[#080A0E] text-xs">
                    {user.displayName?.charAt(0)?.toUpperCase() ||
                      user.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-[#F0EEE8]">
                  {user.displayName || "Usuario"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#111318] border-[rgba(240,238,232,0.08)]">
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer text-[#F0EEE8]">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[rgba(240,238,232,0.08)]" />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="cursor-pointer text-[#FF5F5F] focus:text-[#FF5F5F]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-[0.75rem] tracking-[0.1em] uppercase text-[#9B9D9A] hover:text-[#F0EEE8]"
              >
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#C8F73A] text-[#080A0E] hover:bg-[#C8F73A]/90 text-[0.75rem] tracking-[0.1em] uppercase font-medium px-5 py-2.5">
                Empezar gratis
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-[#F0EEE8]"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden fixed top-16 left-0 right-0 bg-[#080A0E]/98 backdrop-blur-md overflow-hidden transition-all duration-300 border-b border-[rgba(240,238,232,0.08)]",
          mobileMenuOpen ? "max-h-80" : "max-h-0"
        )}
      >
        <div className="px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm tracking-[0.1em] uppercase text-[#9B9D9A] hover:text-[#F0EEE8] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[rgba(240,238,232,0.08)] flex gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#C8F73A] text-[#080A0E] text-xs tracking-[0.1em] uppercase">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1 border-[rgba(240,238,232,0.08)] text-[#FF5F5F] text-xs"
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-[#9B9D9A] text-xs tracking-[0.1em] uppercase">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#C8F73A] text-[#080A0E] text-xs tracking-[0.1em] uppercase">
                    Empezar gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
