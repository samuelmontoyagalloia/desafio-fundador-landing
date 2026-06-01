import { useState, useEffect, useRef } from 'react'

const KIT_CSS = `
  /* ── Kill modal / overlay ── */
  .formkit-overlay,
  .formkit-slide-in,
  body > .formkit-form[data-format="modal"],
  body > .formkit-form[data-format="slide in"] {
    display: none !important;
    pointer-events: none !important;
  }

  /* ── Hide powered-by watermark ── */
  .formkit-powered-by-convertkit-container,
  .formkit-powered-by-convertkit,
  a[class*="powered-by"] {
    display: none !important;
  }
`

function isVisible(el) {
  if (!el) return false
  const s = getComputedStyle(el)
  return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0'
}

export default function WaitlistForm({ onSubscribed }) {
  const [succeeded, setSucceeded] = useState(false)
  const ref = useRef(null)
  const lastEmail = useRef('')
  const counted = useRef(false)

  useEffect(() => {
    if (!ref.current) return

    const style = document.createElement('style')
    style.textContent = KIT_CSS
    document.head.appendChild(style)

    const script = document.createElement('script')
    script.src = 'https://samuelmontoya.kit.com/2ee48b4cf7/index.js'
    script.setAttribute('data-uid', '2ee48b4cf7')
    script.async = true
    ref.current.appendChild(script)

    function handleSuccess() {
      if (counted.current) return
      counted.current = true
      setSucceeded(true)
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lastEmail.current }),
      })
        .then(() => onSubscribed?.())
        .catch(() => onSubscribed?.())
    }

    function checkSuccess() {
      if (!ref.current || counted.current) return
      const successEl = ref.current.querySelector('[data-element="success"], .formkit-alert-success')
      if (successEl && isVisible(successEl)) handleSuccess()
    }

    function patchKit() {
      if (!ref.current) return

      // Patch button text
      const btn = ref.current.querySelector('button[data-element="submit"], button[type="submit"]')
      if (btn) {
        const label = btn.querySelector('span:not([class*="spinner"])')
        const target = label ?? btn
        if (target.textContent.trim() !== 'Quiero mi lugar →') {
          target.textContent = 'Quiero mi lugar →'
        }
      }

      // Hide branding
      ref.current
        .querySelectorAll('[class*="powered-by"], a[href*="kit.com"][class*="powered"]')
        .forEach(el => { el.style.display = 'none' })

      // Hook form submit to capture email + start polling
      const form = ref.current.querySelector('form')
      if (form && !form._patched) {
        form._patched = true
        form.addEventListener('submit', () => {
          const input = form.querySelector('input[type="email"]')
          if (input) lastEmail.current = input.value
          counted.current = false

          // Poll for success every 300 ms for up to 10 s
          let attempts = 0
          const poll = setInterval(() => {
            attempts++
            checkSuccess()
            if (counted.current || attempts > 33) clearInterval(poll)
          }, 300)
        })
      }

      checkSuccess()
    }

    // Watch childList AND attribute changes (Kit reveals success by toggling display/style)
    const localObserver = new MutationObserver(patchKit)
    localObserver.observe(ref.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'aria-hidden'],
    })

    // Remove any Kit modal appended to body
    const bodyObserver = new MutationObserver(() => {
      document
        .querySelectorAll(
          '.formkit-overlay, body > .formkit-form[data-format="modal"], body > .formkit-form[data-format="slide in"]'
        )
        .forEach(el => el.remove())
    })
    bodyObserver.observe(document.body, { childList: true })

    return () => {
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
