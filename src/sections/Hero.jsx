import Eyebrow from '../components/Eyebrow'

export default function Hero({ remaining }) {
  return (
    <header className="bg-paper relative overflow-hidden">
      <div className="absolute w-[820px] h-[820px] bg-hero-glow -top-40 -left-56 pointer-events-none" />
      <div className="max-w-[1120px] mx-auto px-6 md:px-10 pt-[58px] pb-[52px] md:pt-[92px] md:pb-[84px] relative">
        <div className="max-w-[880px]">
          <Eyebrow>Encuentra tu negocio</Eyebrow>
          <h1 className="font-display font-semibold text-[clamp(40px,6vw,70px)] leading-[1.05] tracking-[-0.025em] text-ink mt-[26px] [text-wrap:balance]">
            Encuentra tu negocio: de tener talento a{' '}
            <em className="not-italic text-electric">saber qué hacer con él.</em>
          </h1>
          <p className="font-display font-light text-[clamp(18px,2vw,23px)] leading-[1.55] tracking-[-0.005em] text-stone mt-6 max-w-[640px]">
            <strong className="text-ink font-semibold">4 sesiones de coaching 1:1 en un mes exacto.</strong>
            <br />
            De la confusión total a tu primera oferta en el mercado — sin dejar tu trabajo.
          </p>
          <div className="mt-[38px] flex flex-col gap-4 items-start">
            <a
              href="#reservar"
              className="inline-flex items-center gap-[10px] font-display font-bold text-[12px] tracking-[0.12em] uppercase py-4 px-7 bg-electric text-cream rounded-[6px] transition-colors duration-[160ms] hover:bg-electric-deep whitespace-nowrap group"
            >
              Quiero mi lugar{' '}
              <span className="text-[14px] transition-transform duration-[160ms] group-hover:translate-x-[3px]">→</span>
            </a>
            <div className="flex items-start gap-[11px]">
              <span className="w-[9px] h-[9px] rounded-full bg-electric flex-none mt-[7px] animate-pulse-ring" />
              <div className="flex flex-col gap-[3px]">
                <span className="font-display font-bold text-[20px] tracking-[-0.01em] text-ink leading-[1.1]">
                  Quedan{' '}
                  <span className="text-electric">
                    {remaining !== null ? remaining : '4'}
                  </span>{' '}
                  de 6
                </span>
                <span className="font-body text-[13px] leading-[1.5] text-stone">
                  cupos —{' '}
                  <span className="text-electric font-semibold">90% de descuento</span>
                  . Cuando se llenen, el precio sube.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
