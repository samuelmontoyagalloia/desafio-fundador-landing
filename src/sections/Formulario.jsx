import WaitlistForm from '../components/WaitlistForm'

export default function Formulario({ remaining, onSubscribed }) {
  return (
    <section id="reservar" className="bg-electric text-cream py-14 md:py-[88px] relative overflow-hidden">
      <div className="absolute w-[700px] h-[700px] bg-form-glow -top-[200px] -right-[160px] pointer-events-none" />
      <div className="max-w-[1120px] mx-auto px-6 md:px-10 relative">
        <div className="text-center max-w-[680px] mx-auto">
          <span className="font-body text-[11px] font-medium tracking-[0.28em] uppercase text-cream/80 inline-flex items-center gap-[10px]">
            <span className="w-2 h-2 bg-cream flex-none" />
            Reserva el tuyo antes de que abran
          </span>
          <h2 className="font-display font-bold text-[clamp(30px,4vw,50px)] leading-[1.08] tracking-[-0.02em] text-cream mt-[22px] [text-wrap:balance] m-0">
            Los primeros 5 cupos son gratis.
          </h2>
          <p className="font-display font-light text-[19px] leading-[1.55] tracking-[-0.005em] text-cream/85 mt-[18px] m-0">
            Quedan{' '}
            <strong className="font-bold text-cream">
              {remaining !== null ? remaining : '—'} de 5
            </strong>{' '}
            lugares gratuitos. Después, el precio sube.
          </p>
          <div className="mt-[34px]">
            <WaitlistForm onSubscribed={onSubscribed} />
          </div>
        </div>
      </div>
    </section>
  )
}
