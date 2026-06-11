import Eyebrow from '../components/Eyebrow'

const VideoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15.75 10.5l4.72-2.796a.75.75 0 011.28.53v7.532a.75.75 0 01-1.28.53L15.75 13.5"/>
    <rect x="2.25" y="5.25" width="13.5" height="13.5" rx="2.25"/>
  </svg>
)

const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
  </svg>
)

const TargetIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9.75"/>
    <circle cx="12" cy="12" r="5.625"/>
    <circle cx="12" cy="12" r="1.5"/>
  </svg>
)

const SparklesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>
  </svg>
)

const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
  </svg>
)

const BONUSES = [
  {
    Icon: VideoIcon,
    title: 'Repetición ilimitada',
    desc: 'Grabación de cada sesión. Vuelve a cada momento clave cuando quieras.',
  },
  {
    Icon: BookIcon,
    title: 'Cuadernos del Fundador',
    desc: '3 workbooks para trabajar entre sesiones y llegar preparado a cada una.',
  },
  {
    Icon: TargetIcon,
    title: 'Arsenal de Ventas',
    desc: 'Scripts de prospección, seguimiento y cierre para conseguir tus primeros clientes.',
  },
  {
    Icon: SparklesIcon,
    title: 'La Máquina de Guiones',
    desc: 'El prompt exacto para crear contenido para tu negocio desde cero.',
  },
]

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

        {/* Bonificaciones */}
        <div className="mt-14 md:mt-20 pt-10 border-t border-dust">
          <Eyebrow>Bonificaciones incluidas</Eyebrow>
          <div className="grid grid-cols-2 gap-[14px] md:gap-4 mt-8">
            {BONUSES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-cream border border-dust border-t-2 border-t-electric flex flex-col p-6 md:p-[28px_26px_30px]"
              >
                <span className="text-electric">
                  <Icon />
                </span>
                <span className="font-display font-bold text-[18px] md:text-[20px] tracking-[-0.01em] leading-[1.1] text-ink mt-[18px]">
                  {title}
                </span>
                <span className="font-body font-light text-[14px] leading-[1.6] text-stone mt-[10px]">
                  {desc}
                </span>
              </div>
            ))}
          </div>

          {/* Premium bonus */}
          <div className="mt-[14px] md:mt-4 bg-cream border border-electric/25 border-t-2 border-t-electric flex flex-col md:flex-row md:items-start gap-5 p-6 md:p-[28px_32px]">
            <span className="text-electric flex-none md:mt-[2px]">
              <SearchIcon />
            </span>
            <div className="flex flex-col">
              <span className="font-body text-[10px] font-semibold tracking-[0.28em] uppercase text-electric">
                Bonus premium
              </span>
              <span className="font-display font-bold text-[18px] md:text-[20px] tracking-[-0.01em] leading-[1.1] text-ink mt-[6px]">
                Investigación de mercado personalizada
              </span>
              <span className="font-body font-light text-[14px] leading-[1.6] text-stone mt-[10px]">
                Antes de tu Sesión 2 investigo tu idea en internet — demanda real, competencia, precios de mercado y dos referentes que ya lo están logrando. Llegas a la sesión con datos, no con suposiciones.
              </span>
            </div>
          </div>
        </div>

        {/* Price hierarchy */}
        <div className="mt-12 md:mt-16 pt-10 border-t border-dust text-center">
          <p className="font-display font-normal text-[18px] md:text-[20px] leading-[1.2] text-stone line-through decoration-red-500">
            $1.035 USD
          </p>
          <p className="font-display font-bold text-[clamp(30px,4vw,50px)] leading-[1.08] tracking-[-0.02em] text-electric mt-2">
            $10 USD
          </p>
          <p className="font-body font-light text-[15px] leading-[1.6] text-stone mt-4">
            Este ciclo — 90% de descuento. Cuando se llenen los 6 cupos, el precio sube.
          </p>
        </div>
      </div>
    </section>
  )
}
