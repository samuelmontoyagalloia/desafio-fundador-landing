export default function Footer() {
  return (
    <footer className="bg-ink">
      <div className="max-w-[1120px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-9 gap-4 font-body text-[13px] font-light text-stone">
          <span className="font-display font-bold text-[15px] tracking-[-0.01em] text-cream inline-flex items-center gap-[9px]">
            <span className="w-[7px] h-[7px] rounded-full bg-electric-light flex-none" />
            El Desafío del Fundador
          </span>
          <span>
            © 2026 Samuel Montoya.
            <br className="md:hidden" /> Todos los derechos reservados.
          </span>
        </div>
      </div>
    </footer>
  )
}
