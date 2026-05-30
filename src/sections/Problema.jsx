import Eyebrow from '../components/Eyebrow'

export default function Problema() {
  return (
    <section className="bg-ink py-14 md:py-[88px]">
      <div className="max-w-[1120px] mx-auto px-6 md:px-10">
        <Eyebrow light>El punto de partida</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 items-center mt-[26px]">
          <h2 className="font-display font-bold text-[clamp(28px,3.6vw,44px)] leading-[1.12] tracking-[-0.015em] text-cream [text-wrap:balance] m-0">
            ¿Sabes que quieres construir algo, pero no sabes qué ni por dónde empezar?
          </h2>
          <p className="font-body font-light text-[18px] leading-[1.8] text-[rgba(245,242,237,0.66)] m-0">
            Tienes las ganas, tienes las ideas; pero siempre terminas igual:{' '}
            <span className="text-cream">cansado, bloqueado y mirando el celular.</span>{' '}
            No es que no puedas. Es que nadie te ha dado el mapa.
          </p>
        </div>
      </div>
    </section>
  )
}
