import { useState } from 'react'

export default function WaitlistForm({ onSubscribed }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      onSubscribed?.()
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
