const SOCIAL_LINKS = [
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@smontoya.g?_r=1&_t=ZS-96sLCTr8R2z',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.14 8.14 0 004.78 1.54V6.78a4.85 4.85 0 01-1.01-.09z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/smontoyag?igsh=NTJkamw3bDM3ZGU3&utm_source=qr',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@SamuelMontoyaIA',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-ink">
      <div className="max-w-[1120px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-9 font-body text-[13px] font-light text-stone">

          {/* Brand — centered on mobile with bottom divider; left-aligned item on desktop */}
          <span className="
            inline-flex items-center gap-[9px]
            justify-center md:justify-start
            font-display font-bold text-[15px] tracking-[-0.01em] text-cream
            pb-6 border-b border-white/10
            md:pb-0 md:border-none
          ">
            <span className="w-[7px] h-[7px] rounded-full bg-electric-light flex-none" />
            Encuentra tu negocio — Samuel Montoya
          </span>

          {/*
            On mobile  → flex row: socials left, copyright right (justify-between)
            On desktop → display:contents dissolves this wrapper so its two children
                         become direct flex items of the outer row alongside brand
          */}
          <div className="flex items-center justify-between gap-6 mt-6 md:mt-0 md:contents">

            <div className="flex items-center gap-5">
              {SOCIAL_LINKS.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="text-stone hover:text-cream transition-colors duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>

            <span className="text-right md:text-left">
              © 2026 Samuel Montoya.<br className="md:hidden" /> Todos los derechos reservados.
            </span>

          </div>
        </div>
      </div>
    </footer>
  )
}
