export default function Garantia() {
  return (
    <section className="bg-paper py-14 md:py-[88px]">
      <div className="max-w-[1120px] mx-auto px-6 md:px-10 flex justify-center">
        <div className="bg-cream border border-dust border-l-2 border-l-electric flex flex-col md:flex-row items-start md:items-center gap-[22px] md:gap-[34px] p-8 md:p-[44px_48px] max-w-[880px] w-full">
          <div className="flex-none w-[52px] h-[52px] md:w-16 md:h-16 text-electric">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-bold text-[clamp(24px,3vw,34px)] leading-[1.1] tracking-[-0.015em] text-ink m-0">
              Garantía total. El riesgo es mío.
            </h2>
            <p className="font-body font-light text-[17px] leading-[1.7] text-stone mt-3 max-w-[560px]">
              Si completas las 4 sesiones, haces las tareas y no evidencias un avance real —{' '}
              <span className="text-ink font-medium">te devuelvo el 100%. Sin preguntas.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
