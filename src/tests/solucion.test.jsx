import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import Solucion from '../sections/Solucion'

// ─── Session cards ─────────────────────────────────────────────────────────

describe('Solucion — session cards', () => {
  beforeEach(() => render(<Solucion />))

  it('renders all 4 session card titles', () => {
    expect(screen.getByText('Diagnóstico')).toBeInTheDocument()
    expect(screen.getByText('Tu dirección')).toBeInTheDocument()
    expect(screen.getByText('Tu oferta')).toBeInTheDocument()
    expect(screen.getByText('Tu plan')).toBeInTheDocument()
  })

  it('renders numbered session labels 01–04', () => {
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
  })

  it('renders session tags', () => {
    expect(screen.getByText('Sesión 1')).toBeInTheDocument()
    expect(screen.getByText('Sesión 4')).toBeInTheDocument()
  })
})

// ─── Bonus card titles ─────────────────────────────────────────────────────

describe('Solucion — bonus cards', () => {
  beforeEach(() => render(<Solucion />))

  it('renders "Repetición ilimitada" (renamed from "El Vault")', () => {
    expect(screen.getByText('Repetición ilimitada')).toBeInTheDocument()
  })

  it('does NOT render "El Vault" anywhere', () => {
    expect(screen.queryByText('El Vault')).not.toBeInTheDocument()
  })

  it('renders all 4 standard bonus card titles', () => {
    expect(screen.getByText('Repetición ilimitada')).toBeInTheDocument()
    expect(screen.getByText('Cuadernos del Fundador')).toBeInTheDocument()
    expect(screen.getByText('Arsenal de Ventas')).toBeInTheDocument()
    expect(screen.getByText('La Máquina de Guiones')).toBeInTheDocument()
  })

  it('renders the premium bonus title', () => {
    expect(screen.getByText('Investigación de mercado personalizada')).toBeInTheDocument()
  })

  it('shows the "Bonus premium" label (case-insensitive)', () => {
    expect(screen.getByText(/bonus premium/i)).toBeInTheDocument()
  })

  it('renders all 4 bonus descriptions', () => {
    expect(screen.getByText(/Grabación de cada sesión/)).toBeInTheDocument()
    expect(screen.getByText(/3 workbooks para trabajar entre sesiones/)).toBeInTheDocument()
    expect(screen.getByText(/Scripts de prospección/)).toBeInTheDocument()
    expect(screen.getByText(/prompt exacto para crear contenido/)).toBeInTheDocument()
  })

  it('renders the premium bonus description with unique phrases', () => {
    expect(screen.getByText(/demanda real/)).toBeInTheDocument()
    expect(screen.getByText(/no con suposiciones/)).toBeInTheDocument()
  })

  it('renders icons (SVG elements) for bonus cards', () => {
    const svgs = document.querySelectorAll('svg[aria-hidden="true"]')
    // 5 bonus icons (4 standard + 1 premium search icon)
    expect(svgs.length).toBeGreaterThanOrEqual(5)
  })
})

// ─── Price hierarchy ───────────────────────────────────────────────────────

describe('Solucion — price hierarchy', () => {
  beforeEach(() => render(<Solucion />))

  it('renders the original value "$1.035 USD"', () => {
    expect(screen.getByText('$1.035 USD')).toBeInTheDocument()
  })

  it('applies line-through to the original value', () => {
    const el = screen.getByText('$1.035 USD')
    expect(el.className).toContain('line-through')
  })

  it('applies red decoration to the strikethrough', () => {
    const el = screen.getByText('$1.035 USD')
    expect(el.className).toContain('decoration-red-500')
  })

  it('applies muted (stone) color to the original value', () => {
    const el = screen.getByText('$1.035 USD')
    expect(el.className).toContain('text-stone')
  })

  it('renders the current price "$10 USD"', () => {
    expect(screen.getByText('$10 USD')).toBeInTheDocument()
  })

  it('applies electric (accent) color to the current price', () => {
    const el = screen.getByText('$10 USD')
    expect(el.className).toContain('text-electric')
  })

  it('applies bold display font weight to the current price', () => {
    const el = screen.getByText('$10 USD')
    expect(el.className).toContain('font-bold')
  })

  it('renders the discount support text', () => {
    const el = screen.getByText(/90% de descuento/)
    expect(el).toBeInTheDocument()
  })

  it('mentions 6 cupos in the support text', () => {
    expect(screen.getByText(/6 cupos/)).toBeInTheDocument()
  })

  it('renders original price before current price in the DOM', () => {
    const originalPrice = screen.getByText('$1.035 USD')
    const currentPrice = screen.getByText('$10 USD')
    expect(
      originalPrice.compareDocumentPosition(currentPrice) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})
