import { useState } from 'react'

const faqs = [
  {
    q: '¿Cuánto cuesta?',
    a: 'Los primeros 5 cupos son completamente gratis. Después el precio sube progresivamente. Quien entra primero, paga menos.',
  },
  {
    q: '¿Cuándo abre?',
    a: 'Muy pronto. Regístrate ahora y serás el primero en saberlo.',
  },
  {
    q: '¿Para quién es esto?',
    a: 'Para jóvenes empleados que quieren construir un negocio pero no saben qué ni cómo. Si sientes que deberías estar construyendo algo; esto es para ti.',
  },
]

function Eyebrow({ children, light = false }) {
  return (
    <span
      className={`font-body text-[10px] font-semibold tracking-[0.34em] uppercase inline-flex items-center gap-3 ${
        light ? 'text-electric-light' : 'text-electric'
      }`}
    >
      <span
        className={`w-[7px] h-[7px] rounded-full flex-none ${
          light ? 'bg-electric-light' : 'bg-electric'
        }`}
      />
      {children}
    </span>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-dust">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full bg-transparent border-none cursor-pointer flex items-center justify-between gap-6 py-[26px] px-1 text-left font-display font-bold text-[clamp(18px,2vw,22px)] tracking-[-0.01em] transition-colors duration-[160ms] ${
          open ? 'text-electric' : 'text-ink hover:text-electric'
        }`}
      >
        {q}
        <svg
          className={`flex-none w-[22px] h-[22px] transition-transform duration-[240ms] ${
            open ? 'rotate-180 text-electric' : 'text-stone'
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-[240ms] ease-out ${
          open ? 'max-h-[300px]' : 'max-h-0'
        }`}
      >
        <p className="font-body font-light text-[17px] leading-[1.8] text-stone px-1 pb-7 max-w-[640px]">
          {a}
        </p>
      </div>
    </div>
  )
}

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const body = new FormData()
      body.append('email_address', email)
      const res = await fetch('https://app.kit.com/forms/9504110/subscriptions', {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="font-display font-semibold text-[18px] tracking-[-0.01em] text-cream">
        ¡Tu lugar está reservado! Te avisamos cuando abramos.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Tu email"
        className="w-full font-body text-[15px] text-ink placeholder:text-stone/60 bg-cream rounded-[6px] px-4 py-[14px] border-none outline-none focus:ring-2 focus:ring-cream/40"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full inline-flex items-center justify-center gap-[8px] font-display font-bold text-[12px] tracking-[0.12em] uppercase py-[14px] px-6 bg-ink text-cream rounded-[6px] transition-colors duration-[160ms] hover:bg-electric-deep disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? 'Enviando…' : 'Quiero mi lugar →'}
      </button>
      {status === 'error' && (
        <p className="w-full font-body text-[13px] text-cream/80 mt-1">
          Algo salió mal. Intenta de nuevo.
        </p>
      )}
    </form>
  )
}

export default function App() {
  return (
    <div className="font-body antialiased bg-paper text-ink overflow-x-hidden">

      {/* Grain texture overlay */}
      <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.022] bg-grain" />

      {/* ══════════════ HERO ══════════════ */}
      <header className="bg-paper relative overflow-hidden">
        <div className="absolute w-[820px] h-[820px] bg-hero-glow -top-40 -left-56 pointer-events-none" />
        <div className="max-w-[1120px] mx-auto px-6 md:px-10 pt-[58px] pb-[52px] md:pt-[92px] md:pb-[84px] relative">
          <div className="max-w-[880px]">
            <Eyebrow>El Desafío del Fundador</Eyebrow>
            <h1 className="font-display font-semibold text-[clamp(40px,6vw,70px)] leading-[1.05] tracking-[-0.025em] text-ink mt-[26px] [text-wrap:balance]">
              Tu primera idea de negocio,{' '}
              <em className="not-italic text-electric">identificada y ejecutada</em>; sin dejar tu trabajo.
            </h1>
            <p className="font-display font-light text-[clamp(18px,2vw,23px)] leading-[1.55] tracking-[-0.005em] text-stone mt-6 max-w-[640px]">
              Un sistema paso a paso con herramientas de IA que te guían desde la confusión total hasta tus{' '}
              <strong className="text-ink font-semibold">primeras facturaciones</strong>, en{' '}
              <strong className="text-ink font-semibold">90 días</strong>.
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
                    Quedan <span className="text-electric">3</span> de 5
                  </span>
                  <span className="font-body text-[13px] leading-[1.5] text-stone">
                    cupos gratuitos. Reserva el tuyo antes de que abran.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════ PROBLEMA ══════════════ */}
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

      {/* ══════════════ SOLUCIÓN ══════════════ */}
      <section className="bg-paper-warm py-14 md:py-[88px]">
        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-14 items-center">
            <div>
              <Eyebrow>La solución</Eyebrow>
              <h2 className="font-display font-bold text-[clamp(28px,3.6vw,44px)] leading-[1.08] tracking-[-0.015em] text-ink mt-[26px] m-0 mt-[26px]">
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

      {/* ══════════════ FORMULARIO ══════════════ */}
      <section id="reservar" className="bg-electric text-cream py-14 md:py-[88px] relative overflow-hidden">
        <div className="absolute w-[700px] h-[700px] bg-form-glow -top-[200px] -right-[160px] pointer-events-none" />
        <div className="max-w-[1120px] mx-auto px-6 md:px-10 relative">
          <div className="text-center max-w-[680px] mx-auto">
            <span className="font-body text-[11px] font-medium tracking-[0.28em] uppercase text-cream/80 inline-flex items-center gap-[10px]">
              <span className="w-2 h-2 bg-cream flex-none" />
              Reserva el tuyo antes de que abran
            </span>
            <h2 className="font-display font-bold text-[clamp(30px,4vw,50px)] leading-[1.08] tracking-[-0.02em] text-cream mt-[22px] [text-wrap:balance] m-0 mt-[22px]">
              Los primeros 5 cupos son gratis.
            </h2>
            <p className="font-display font-light text-[19px] leading-[1.55] tracking-[-0.005em] text-cream/85 mt-[18px] m-0 mt-[18px]">
              Quedan <strong className="font-bold text-cream">3 de 5</strong> lugares gratuitos. Después, el precio sube.
            </p>
            <div className="mt-[34px]">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section className="bg-cream py-14 md:py-[88px]">
        <div className="max-w-[1120px] mx-auto px-6 md:px-10">
          <Eyebrow>Dudas</Eyebrow>
          <h2 className="font-display font-bold text-[clamp(26px,3.2vw,40px)] tracking-[-0.015em] text-ink mt-[22px] mb-11 m-0 mt-[22px] mb-11">
            Preguntas frecuentes
          </h2>
          <div className="border-t border-dust">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
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

    </div>
  )
}
