import { useState, useEffect, useRef } from 'react'

export default function WaitlistForm({ onSubscribed }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const kitRef = useRef(null)

  useEffect(() => {
    if (!kitRef.current) return

    const script = document.createElement('script')
    script.src = 'https://samuelmontoya.kit.com/2ee48b4cf7/index.js'
    script.setAttribute('data-uid', '2ee48b4cf7')
    script.async = true
    kitRef.current.appendChild(script)

    // Auto-close any Kit modal/overlay that appears in the body
    const observer = new MutationObserver(() => {
      for (const selector of ['.formkit-overlay', '.formkit-modal', '[data-formkit-modal]']) {
        const el = document.querySelector(selector)
        if (el) {
          const closeBtn = el.querySelector('[data-close], .formkit-close, button[type="button"]')
          if (closeBtn) closeBtn.click()
          else el.remove()
        }
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  function submitToKit(emailValue) {
    return new Promise(resolve => {
      const container = kitRef.current
      if (!container) return resolve()

      const kitInput = container.querySelector('input[type="email"]')
      const kitSubmit = container.querySelector('button[type="submit"], input[type="submit"]')

      if (!kitInput || !kitSubmit) return resolve()

      // Native setter needed for React-controlled Kit inputs
      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
      nativeSetter.call(kitInput, emailValue)
      kitInput.dispatchEvent(new Event('input', { bubbles: true }))
      kitInput.dispatchEvent(new Event('change', { bubbles: true }))

      kitSubmit.click()

      setTimeout(resolve, 1500)
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')

    try {
      await submitToKit(email)

      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => {})

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
    <>
      {/* Kit embed off-screen — handles actual subscription */}
      <div
        ref={kitRef}
        aria-hidden="true"
        style={{ position: 'fixed', left: '-9999px', top: 0, width: '320px', opacity: 0, pointerEvents: 'none' }}
      />

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
    </>
  )
}
