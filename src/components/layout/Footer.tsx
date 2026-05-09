export function Footer() {
  return (
    <footer className="border-t border-[rgba(239,237,231,0.07)] px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="font-[family-name:var(--font-display)] text-[1.35rem] tracking-wider text-[#EFEDE7]">
        Deporte<span className="text-[#C8F73A]">Vision</span>
      </div>
      <div className="flex gap-8">
        {["Para clubes", "Casos de éxito", "Términos", "Privacidad", "Contacto"].map((item) => (
          <span key={item} className="text-[0.72rem] tracking-[0.06em] text-[#8E9090] hover:text-[#EFEDE7] transition-colors cursor-pointer">{item}</span>
        ))}
      </div>
      <div className="text-[0.72rem] tracking-[0.06em] text-[#8E9090]">
        &copy; 2026 DeporteVision. Tecnología para clubes deportivos.
      </div>
    </footer>
  );
}
