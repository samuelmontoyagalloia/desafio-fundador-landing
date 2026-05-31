import { useEffect, useRef } from 'react'

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

export default function WaitlistForm({ onSubscribed }) {
  const ref = useRef(null)
  const lastEmail = useRef('')
  const counted = useRef(false)

  useEffect(() => {
    if (!ref.current) return

    // Inject overrides before Kit renders
    const style = document.createElement('style')
    style.textContent = KIT_CSS
    document.head.appendChild(style)

    // Load Kit embed inside our container
    const script = document.createElement('script')
    script.src = 'https://samuelmontoya.kit.com/2ee48b4cf7/index.js'
    script.setAttribute('data-uid', '2ee48b4cf7')
    script.async = true
    ref.current.appendChild(script)

    function patchKit() {
      if (!ref.current) return

      // ── Patch button text ──
      const btn = ref.current.querySelector('button[data-element="submit"], button[type="submit"]')
      if (btn) {
        const label = btn.querySelector('span:not([class*="spinner"])')
        const target = label ?? btn
        if (target.textContent.trim() !== 'Quiero mi lugar →') {
          target.textContent = 'Quiero mi lugar →'
        }
      }

      // ── Hide any remaining branding nodes ──
      ref.current
        .querySelectorAll('[class*="powered-by"], a[href*="kit.com"][class*="powered"]')
        .forEach(el => { el.style.display = 'none' })

      // ── Capture email on submit ──
      const form = ref.current.querySelector('form')
      if (form && !form._patched) {
        form._patched = true
        form.addEventListener('submit', () => {
          const input = form.querySelector('input[type="email"]')
          if (input) lastEmail.current = input.value
          counted.current = false
        })
      }

      // ── Detect Kit success state → update counter ──
      const success = ref.current.querySelector('[data-element="success"], .formkit-alert-success')
      if (success && !counted.current) {
        counted.current = true
        fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: lastEmail.current }),
        }).catch(() => {})
        onSubscribed?.()
      }
    }

    // Watch our container for Kit rendering mutations
    const localObserver = new MutationObserver(patchKit)
    localObserver.observe(ref.current, { childList: true, subtree: true })

    // Watch body to nuke any Kit-appended modal nodes immediately
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

  return <div ref={ref} />
}
