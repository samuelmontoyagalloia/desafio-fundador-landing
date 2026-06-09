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
