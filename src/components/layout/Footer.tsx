import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(240,238,232,0.08)] px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="font-[family-name:var(--font-display)] text-2xl tracking-wider">
        Deporte<span className="text-[#C8F73A]">Vision</span>
      </div>
      <div className="flex gap-8">
        <span className="text-[0.75rem] tracking-[0.06em] text-[#9B9D9A] hover:text-[#F0EEE8] transition-colors cursor-pointer">
          Términos
        </span>
        <span className="text-[0.75rem] tracking-[0.06em] text-[#9B9D9A] hover:text-[#F0EEE8] transition-colors cursor-pointer">
          Privacidad
        </span>
        <span className="text-[0.75rem] tracking-[0.06em] text-[#9B9D9A] hover:text-[#F0EEE8] transition-colors cursor-pointer">
          Contacto
        </span>
      </div>
      <div className="text-[0.75rem] tracking-[0.06em] text-[#9B9D9A]">
        &copy; 2026 DeporteVision. Todos los derechos reservados.
      </div>
    </footer>
  );
}
