import { useEffect, useRef } from 'react'

export default function WaitlistForm() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const script = document.createElement('script')
    script.src = 'https://samuelmontoya.kit.com/2ee48b4cf7/index.js'
    script.setAttribute('data-uid', '2ee48b4cf7')
    script.async = true
    ref.current.appendChild(script)
  }, [])

  return <div ref={ref} />
}
