import Eyebrow from '../components/Eyebrow'

const SESSIONS = [
  {
    n: '01',
    tag: 'Sesión 1',
    title: 'Diagnóstico',
    result: 'Defines tu Ikigai y mapeas tu punto de partida.',
  },
  {
    n: '02',
    tag: 'Sesión 2',
    title: 'Tu dirección',
    result: 'Identificas tu mejor idea de negocio entre 3 opciones reales.',
  },
  {
    n: '03',
    tag: 'Sesión 3',
    title: 'Tu oferta',
    result: 'Construyes tu oferta completa con precio y primeros clientes.',
  },
  {
    n: '04',
    tag: 'Sesión 4',
    title: 'Tu plan',
    result: 'Cierras con un plan de 90 días listo para ejecutar mañana.',
  },
]

export default function Solucion() {
  return (
    <section className="bg-paper-warm py-14 md:py-[88px]">
      <div className="max-w-[1120px] mx-auto px-6 md:px-10">
        <div className="max-w-[760px]">
          <Eyebrow>La solución</Eyebrow>
          <h2 className="font-display font-bold text-[clamp(28px,3.6vw,44px)] leading-[1.08] tracking-[-0.015em] text-ink mt-[26px] m-0">
            4 sesiones. 1 mes. Tu negocio construido.
          </h2>
          <p className="font-display font-light text-[clamp(18px,2vw,23px)] leading-[1.5] tracking-[-0.005em] text-stone mt-[18px] max-w-[620px]">
            No es un curso. Es{' '}
            <span className="text-ink font-normal">coaching 1:1</span>
            {' '}— construimos juntos, tú ejecutas.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] md:gap-4 mt-8 md:mt-12">
          {SESSIONS.map(({ n, tag, title, result }) => (
            <div
              key={n}
              className="bg-cream border border-dust border-t-2 border-t-electric flex flex-col p-6 md:p-[30px_26px_32px] min-h-0 md:min-h-[230px]"
            >
              <span className="font-display font-light text-[42px] md:text-[52px] leading-[1] tracking-[-0.03em] text-electric">
                {n}
              </span>
              <span className="font-body text-[10px] font-semibold tracking-[0.28em] uppercase text-stone mt-[22px]">
                {tag}
              </span>
              <span className="font-display font-bold text-[20px] md:text-[22px] tracking-[-0.01em] leading-[1.1] text-ink mt-[6px]">
                {title}
              </span>
              <span className="font-body font-light text-[14px] leading-[1.6] text-stone mt-[14px]">
                {result}
              </span>
            </div>
          ))}
        </div>

        {/* Bonus — centered on desktop */}
        <div className="mt-9 md:flex md:justify-center">
          <p className="pt-7 border-t border-dust font-body font-light text-[17px] leading-[1.75] text-stone md:max-w-[820px] md:w-full md:text-center">
            Y además recibes:{' '}
            <span className="text-ink font-medium">
              grabaciones de cada sesión, 3 workbooks de trabajo, Arsenal de Ventas y La Máquina de Guiones.
            </span>{' '}
            Todo valorado en{' '}
            <span className="text-ink font-medium line-through decoration-red-500">$1.035 USD</span>
            . Tu inversión:{' '}
            <span className="text-electric font-semibold">$10 USD</span>
            {' '}en este ciclo.
          </p>
        </div>
      </div>
    </section>
  )
}
