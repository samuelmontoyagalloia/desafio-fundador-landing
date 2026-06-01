import { useState, useEffect, useRef } from 'react'

const KIT_CSS = `
  .formkit-overlay,
  .formkit-slide-in,
  body > .formkit-form[data-format="modal"],
  body > .formkit-form[data-format="slide in"] {
    display: none !important;
    pointer-events: none !important;
  }
  .formkit-powered-by-convertkit-container,
  .formkit-powered-by-convertkit,
  a[class*="powered-by"] {
    display: none !important;
  }
  .formkit-form[data-uid="2ee48b4cf7"] .formkit-alert-error {
    background: #B91C1C !important;
    border-color: #991B1B !important;
    color: #ffffff !important;
    border-radius: 8px !important;
    font-family: "DM Sans", system-ui, sans-serif !important;
    font-size: 14px !important;
    font-weight: 500 !important;
  }
  .formkit-form[data-uid="2ee48b4cf7"] .formkit-alert-error li {
    color: #ffffff !important;
  }
  .formkit-form[data-uid="2ee48b4cf7"] .formkit-submit {
    background-color: #111010 !important;
    color: #FDFCFA !important;
    font-family: "Bricolage Grotesque", system-ui, sans-serif !important;
    font-weight: 700 !important;
    font-size: 12px !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    padding: 0 !important;
    border-radius: 12px !important;
    border: none !important;
    transition: background-color 160ms !important;
    cursor: pointer !important;
    width: 100% !important;
    margin-bottom: 0 !important;
  }
  .formkit-form[data-uid="2ee48b4cf7"] .formkit-submit:hover {
    background-color: #2a2929 !important;
  }
  .formkit-form[data-uid="2ee48b4cf7"] .formkit-submit > span {
    display: block !important;
    padding: 16px 28px !important;
    color: #FDFCFA !important;
  }
`

const ERROR_MSG = 'En este momento no pudimos registrarte, intenta más tarde'

const LS_KEY = 'wl_submitted'

export default function WaitlistForm({ onSubscribed }) {
  const [succeeded, setSucceeded] = useState(() => !!localStorage.getItem(LS_KEY))
  const ref = useRef(null)
  const counted = useRef(false)

  useEffect(() => {
    if (!ref.current) return

    const origFetch = window.fetch
    window.fetch = async function (...args) {
      const response = await origFetch.apply(this, args)
      try {
        const url = (typeof args[0] === 'string' ? args[0] : args[0]?.url) ?? ''
        if (url.includes('subscriptions') && url.includes('kit.com')) {
          response.clone().json().then(data => {
            if (data?.status === 'success' && !counted.current) {
              counted.current = true
              localStorage.setItem(LS_KEY, '1')
              setSucceeded(true)
              origFetch('/api/subscribe', { method: 'POST' })
                .then(r => r.json())
                .then(data => onSubscribed?.(typeof data.remaining === 'number' ? data.remaining : undefined))
                .catch(() => onSubscribed?.())
            }
          }).catch(() => {})
        }
      } catch {}
      return response
    }

    const style = document.createElement('style')
    style.textContent = KIT_CSS
    document.head.appendChild(style)

    const script = document.createElement('script')
    script.src = 'https://samuelmontoya.kit.com/2ee48b4cf7/index.js'
    script.setAttribute('data-uid', '2ee48b4cf7')
    script.async = true
    ref.current.appendChild(script)

    const localObserver = new MutationObserver(() => {
      if (!ref.current) return
      const btn = ref.current.querySelector('button[data-element="submit"], button[type="submit"]')
      if (btn) {
        const label = btn.querySelector('span:not([class*="spinner"])')
        const target = label ?? btn
        if (target.textContent.trim() !== 'Quiero mi lugar →') {
          target.textContent = 'Quiero mi lugar →'
        }
      }
      ref.current
        .querySelectorAll('[class*="powered-by"], a[href*="kit.com"][class*="powered"]')
        .forEach(el => { el.style.display = 'none' })
      const errorAlert = ref.current.querySelector('.formkit-alert-error')
      if (errorAlert) {
        Array.from(errorAlert.children).forEach(li => {
          if (li.textContent.trim() !== ERROR_MSG) li.textContent = ERROR_MSG
        })
      }
    })
    localObserver.observe(ref.current, { childList: true, subtree: true })

    const bodyObserver = new MutationObserver(() => {
      document
        .querySelectorAll('.formkit-overlay, body > .formkit-form[data-format="modal"]')
        .forEach(el => el.remove())
    })
    bodyObserver.observe(document.body, { childList: true })

    return () => {
      window.fetch = origFetch
      localObserver.disconnect()
      bodyObserver.disconnect()
      if (document.head.contains(style)) document.head.removeChild(style)
    }
  }, [onSubscribed])

  if (succeeded) {
    return (
      <p className="font-display font-semibold text-[18px] tracking-[-0.01em] text-cream">
        ¡Tu lugar está reservado! Te avisamos cuando abramos.
      </p>
    )
  }

  return <div ref={ref} />
}
