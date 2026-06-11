import { render, screen, waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import Formulario from '../sections/Formulario'
import Hero from '../sections/Hero'
import { useSubscriberCount } from '../hooks/useSubscriberCount'

// ─── Formulario ────────────────────────────────────────────────────────────

describe('Formulario — counter display', () => {
  it('shows "4 de 6" cupos when remaining is 4', () => {
    render(<Formulario remaining={4} />)
    expect(screen.getByText(/4/)).toBeInTheDocument()
    expect(screen.getByText(/de 6/)).toBeInTheDocument()
  })

  it('shows "1 de 6" cupos when remaining is 1', () => {
    render(<Formulario remaining={1} />)
    expect(screen.getByText(/de 6/)).toBeInTheDocument()
  })

  it('shows "6 de 6" cupos when remaining is 6', () => {
    render(<Formulario remaining={6} />)
    expect(screen.getByText(/de 6/)).toBeInTheDocument()
  })

  it('shows WhatsApp CTA link', () => {
    render(<Formulario remaining={4} />)
    expect(screen.getByRole('link', { name: /Reservar por WhatsApp/i })).toBeInTheDocument()
  })

  it('never shows "—" or undefined — falls back to "4" when remaining is null', () => {
    render(<Formulario remaining={null} />)
    expect(screen.queryByText('—')).not.toBeInTheDocument()
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument()
    expect(screen.getByText(/4/)).toBeInTheDocument()
  })
})

// ─── Formulario — ciclo lleno (isFull) ────────────────────────────────────

describe('Formulario — ciclo lleno (remaining=0)', () => {
  it('shows "Este ciclo está completo" heading when remaining is 0', () => {
    render(<Formulario remaining={0} />)
    expect(screen.getByText(/Este ciclo está completo/)).toBeInTheDocument()
  })

  it('does NOT show the reservation heading when remaining is 0', () => {
    render(<Formulario remaining={0} />)
    expect(screen.queryByText(/Reserva el tuyo/)).not.toBeInTheDocument()
  })

  it('shows waitlist CTA button when remaining is 0', () => {
    render(<Formulario remaining={0} />)
    expect(screen.getByRole('link', { name: /lista de espera/i })).toBeInTheDocument()
  })

  it('does NOT show "Reservar por WhatsApp" when remaining is 0', () => {
    render(<Formulario remaining={0} />)
    expect(screen.queryByRole('link', { name: /Reservar por WhatsApp/i })).not.toBeInTheDocument()
  })

  it('links to the waitlist WhatsApp URL when remaining is 0', () => {
    render(<Formulario remaining={0} />)
    const link = screen.getByRole('link', { name: /lista de espera/i })
    expect(link).toHaveAttribute('href', expect.stringContaining('lista%20de%20espera'))
  })

  it('links to the reservation WhatsApp URL when not full', () => {
    render(<Formulario remaining={4} />)
    const link = screen.getByRole('link', { name: /Reservar por WhatsApp/i })
    expect(link).toHaveAttribute('href', expect.stringContaining('quiero%20mi%20lugar'))
  })

  it('shows "6 cupos de este ciclo" message when remaining is 0', () => {
    render(<Formulario remaining={0} />)
    expect(screen.getByText(/6 cupos de este ciclo/)).toBeInTheDocument()
  })

  it('shows waitlist support text when remaining is 0', () => {
    render(<Formulario remaining={0} />)
    expect(screen.getByText(/nuevo ciclo disponible/)).toBeInTheDocument()
  })

  it('is NOT full when remaining is 1 — shows normal CTA', () => {
    render(<Formulario remaining={1} />)
    expect(screen.getByRole('link', { name: /Reservar por WhatsApp/i })).toBeInTheDocument()
    expect(screen.queryByText(/Este ciclo está completo/)).not.toBeInTheDocument()
  })

  it('is NOT full when remaining is null — shows normal CTA (loading fallback)', () => {
    render(<Formulario remaining={null} />)
    expect(screen.getByRole('link', { name: /Reservar por WhatsApp/i })).toBeInTheDocument()
    expect(screen.queryByText(/Este ciclo está completo/)).not.toBeInTheDocument()
  })
})

// ─── Hero ──────────────────────────────────────────────────────────────────

describe('Hero — counter display', () => {
  it('shows counter when remaining > 0', () => {
    render(<Hero remaining={3} />)
    expect(screen.getByText(/Quedan/)).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows "de 6" in the counter', () => {
    render(<Hero remaining={4} />)
    expect(screen.getByText(/de 6/)).toBeInTheDocument()
  })

  it('falls back to "4" when remaining is null', () => {
    render(<Hero remaining={null} />)
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('CTA link is always visible regardless of remaining count', () => {
    const { rerender } = render(<Hero remaining={4} />)
    expect(screen.getByRole('link', { name: /Quiero mi lugar/i })).toBeInTheDocument()
    rerender(<Hero remaining={0} />)
    expect(screen.getByRole('link', { name: /Quiero mi lugar/i })).toBeInTheDocument()
  })
})

// ─── useSubscriberCount ────────────────────────────────────────────────────

describe('useSubscriberCount', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes to 4 before fetch resolves', () => {
    global.fetch.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useSubscriberCount())
    expect(result.current[0]).toBe(4)
  })

  it('updates to remaining=5 when API returns remaining=5', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ remaining: 5 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(5))
  })

  it('updates to remaining=4 when API returns remaining=4', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ remaining: 4 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(4))
  })

  it('updates to remaining=1 when API returns remaining=1', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ remaining: 1 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(1))
  })

  it('updates to remaining=0 when API returns remaining=0', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ remaining: 0 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(0))
  })

  it('stays at 4 (never undefined/null) when /api/subscribers fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useSubscriberCount())
    await new Promise((r) => setTimeout(r, 50))
    expect(result.current[0]).toBe(4)
    expect(result.current[0]).not.toBeUndefined()
    expect(result.current[0]).not.toBeNull()
  })

  it('stays at 4 when API response is missing remaining field', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({}) })
    const { result } = renderHook(() => useSubscriberCount())
    await new Promise((r) => setTimeout(r, 50))
    expect(result.current[0]).toBe(4)
  })

  it('computes remaining from count=4 → remaining=2', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ count: 4 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(2))
  })

  it('computes remaining=0 from count=6 (all spots taken)', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ count: 6 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(0))
  })

  it('computes remaining=6 from count=0 (no spots taken)', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ count: 0 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(6))
  })

  it('clamps remaining to 0 when count exceeds total (count=99)', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ count: 99 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(0))
  })

  it('prefers count over remaining when both fields are present', async () => {
    // count=2 → remaining should be 4, ignoring the stale remaining=1
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ count: 2, remaining: 1 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(4))
  })

  it('falls back to remaining field when count is absent', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ remaining: 3 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(3))
  })

  it('refresh(knownRemaining) updates state immediately without a fetch', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ remaining: 4 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(4))

    const [, refresh] = result.current
    refresh(2)
    await waitFor(() => expect(result.current[0]).toBe(2))
    expect(global.fetch).toHaveBeenCalledTimes(1) // only the initial call
  })
})
