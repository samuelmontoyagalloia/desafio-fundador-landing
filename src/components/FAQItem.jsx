import { useState } from 'react'

export default function FAQItem({ q, a }) {
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
