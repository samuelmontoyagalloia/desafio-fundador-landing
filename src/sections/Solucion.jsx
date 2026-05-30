import Eyebrow from '../components/Eyebrow'

export default function Solucion() {
  return (
    <section className="bg-paper-warm py-14 md:py-[88px]">
      <div className="max-w-[1120px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-14 items-center">
          <div>
            <Eyebrow>La solución</Eyebrow>
            <h2 className="font-display font-bold text-[clamp(28px,3.6vw,44px)] leading-[1.08] tracking-[-0.015em] text-ink mt-[26px] m-0">
              El sistema que nunca tuviste
            </h2>
          </div>
          <p className="font-body font-light text-[18px] leading-[1.85] text-stone max-w-[560px] m-0">
            El Desafío del Fundador no es un curso de videos. Es un sistema donde cada clase viene con una{' '}
            <span className="text-ink font-normal">herramienta de IA que trabaja con tu información real</span>;{' '}
            para que no solo aprendas, sino que construyas.
          </p>
        </div>
      </div>
    </section>
  )
}
