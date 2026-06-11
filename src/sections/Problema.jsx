import Eyebrow from '../components/Eyebrow'

export default function Problema() {
  return (
    <section className="bg-ink py-14 md:py-[88px]">
      <div className="max-w-[1120px] mx-auto px-6 md:px-10">
        <Eyebrow light>El punto de partida</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 items-center mt-[26px]">
          <h2 className="font-display font-bold text-[clamp(28px,3.6vw,44px)] leading-[1.12] tracking-[-0.015em] text-cream [text-wrap:balance] m-0">
            ¿Sabes que tienes algo, pero no sabes qué hacer con eso?
          </h2>
          <p className="font-body font-light text-[18px] leading-[1.8] text-[rgba(245,242,237,0.66)] m-0">
            Tienes talento. Te falta dirección.<br />
            <span className="text-cream">Nadie te ha construido el mapa — hasta ahora.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
