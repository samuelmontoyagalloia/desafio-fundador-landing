const WA_URL =
  'https://wa.me/573125345323?text=Hola%20Samuel%2C%20quiero%20mi%20lugar%20en%20el%20pr%C3%B3ximo%20ciclo.'

const WA_WAITLIST_URL =
  'https://wa.me/573125345323?text=Hola%20Samuel%2C%20quiero%20unirme%20a%20la%20lista%20de%20espera%20para%20el%20pr%C3%B3ximo%20ciclo.'

const WaIcon = () => (
  <svg className="w-[19px] h-[19px] flex-none" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
)

export default function Formulario({ remaining }) {
  const isFull = remaining !== null && remaining <= 0

  return (
    <section id="reservar" className="bg-electric text-cream py-14 md:py-[88px] relative overflow-hidden">
      <div className="absolute w-[700px] h-[700px] bg-form-glow -top-[200px] -right-[160px] pointer-events-none" />
      <div className="max-w-[1120px] mx-auto px-6 md:px-10 relative">
        <div className="text-center max-w-[680px] mx-auto">
          <span className="font-body text-[11px] font-medium tracking-[0.28em] uppercase text-cream/80 inline-flex items-center gap-[10px]">
            <span className="w-2 h-2 bg-cream flex-none" />
            Cupos limitados por ciclo
          </span>
          <h2 className="font-display font-bold text-[clamp(30px,4vw,50px)] leading-[1.08] tracking-[-0.02em] text-cream mt-[22px] [text-wrap:balance] m-0">
            {isFull
              ? 'Este ciclo está completo'
              : 'Reserva el tuyo para el siguiente ciclo'}
          </h2>
          <p className="font-display font-light text-[19px] leading-[1.55] tracking-[-0.005em] text-cream/85 mt-[18px] m-0">
            {isFull ? (
              <>
                Los 6 cupos de este ciclo ya están ocupados.{' '}
                <strong className="font-bold text-cream">
                  Únete a la lista de espera
                </strong>{' '}
                y te aviso primero cuando abra el siguiente.
              </>
            ) : (
              <>
                Inscripciones próximo ciclo:{' '}
                <strong className="font-bold text-cream">
                  {remaining !== null ? remaining : '4'} de 6
                </strong>{' '}
                cupos —{' '}
                <strong className="font-bold text-cream text-[1.05em]">90% de descuento</strong>
                . Cuando se llenen, el precio sube.
              </>
            )}
          </p>
          <div className="mt-[34px] flex justify-center">
            <a
              href={isFull ? WA_WAITLIST_URL : WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[10px] font-display font-bold text-[13px] tracking-[0.12em] uppercase py-[17px] px-8 bg-ink text-cream rounded-[6px] transition-colors duration-[160ms] hover:bg-black whitespace-nowrap group"
            >
              <WaIcon />
              {isFull ? 'Unirme a la lista de espera' : 'Reservar por WhatsApp'}
            </a>
          </div>
          <p className="font-body font-light text-[15px] leading-[1.6] text-cream/80 mt-[18px]">
            {isFull
              ? 'Te contacto directamente cuando haya un nuevo ciclo disponible.'
              : 'Regístrate y te contacto directamente para confirmar tu lugar.'}
          </p>
        </div>
      </div>
    </section>
  )
}
