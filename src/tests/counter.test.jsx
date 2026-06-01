import { render, screen, waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import Formulario from '../sections/Formulario'
import Hero from '../sections/Hero'
import { useSubscriberCount } from '../hooks/useSubscriberCount'

vi.mock('../components/WaitlistForm', () => ({
  default: () => <div data-testid="waitlist-form-mock" />,
}))

// ─── Formulario ────────────────────────────────────────────────────────────

describe('Formulario — counter display', () => {
  const noop = vi.fn()

  it('shows "Quedan 5 de 5" when count is 0 (remaining = 5)', () => {
    render(<Formulario remaining={5} onSubscribed={noop} />)
    expect(screen.getByText(/Quedan/)).toBeInTheDocument()
    expect(screen.getByText(/5 de 5/)).toBeInTheDocument()
  })

  it('shows "Quedan 4 de 5" when count is 1 (remaining = 4)', () => {
    render(<Formulario remaining={4} onSubscribed={noop} />)
    expect(screen.getByText(/Quedan/)).toBeInTheDocument()
    expect(screen.getByText(/4 de 5/)).toBeInTheDocument()
  })

  it('shows "Quedan 1 de 5" when count is 4 (remaining = 1)', () => {
    render(<Formulario remaining={1} onSubscribed={noop} />)
    expect(screen.getByText(/Quedan/)).toBeInTheDocument()
    expect(screen.getByText(/1 de 5/)).toBeInTheDocument()
  })

  it('hides counter and shows sold-out message when count is 5 (remaining = 0)', () => {
    render(<Formulario remaining={0} onSubscribed={noop} />)
    expect(screen.queryByText(/Quedan/)).not.toBeInTheDocument()
    expect(
      screen.getByText(/Los cupos gratuitos se agotaron\. Regístrate para ser el primero en el próximo ciclo\./),
    ).toBeInTheDocument()
  })

  it('never shows "—" or undefined — defaults to 5 when API fails', () => {
    render(<Formulario remaining={5} onSubscribed={noop} />)
    expect(screen.queryByText('—')).not.toBeInTheDocument()
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument()
    expect(screen.getByText(/5 de 5/)).toBeInTheDocument()
  })
})

// ─── Hero ──────────────────────────────────────────────────────────────────

describe('Hero — counter display', () => {
  it('shows counter when remaining > 0', () => {
    render(<Hero remaining={3} />)
    expect(screen.getByText(/Quedan/)).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('hides counter entirely when remaining is 0', () => {
    render(<Hero remaining={0} />)
    expect(screen.queryByText(/Quedan/)).not.toBeInTheDocument()
    expect(screen.queryByText(/de 5/)).not.toBeInTheDocument()
  })

  it('CTA link is always visible regardless of remaining count', () => {
    const { rerender } = render(<Hero remaining={5} />)
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

  it('initializes to 5 (TOTAL_FREE_SPOTS) before fetch resolves', () => {
    global.fetch.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useSubscriberCount())
    expect(result.current[0]).toBe(5)
  })

  it('updates to remaining=5 when API returns count=0', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ remaining: 5, count: 0 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(5))
  })

  it('updates to remaining=4 when API returns count=1', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ remaining: 4, count: 1 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(4))
  })

  it('updates to remaining=1 when API returns count=4', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ remaining: 1, count: 4 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(1))
  })

  it('updates to remaining=0 when API returns count=5', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ remaining: 0, count: 5 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(0))
  })

  it('stays at 5 (never undefined/null/dash) when /api/subscribers fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useSubscriberCount())
    await new Promise((r) => setTimeout(r, 50))
    expect(result.current[0]).toBe(5)
    expect(result.current[0]).not.toBeUndefined()
    expect(result.current[0]).not.toBeNull()
  })

  it('stays at 5 when API response is missing remaining field', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({}) })
    const { result } = renderHook(() => useSubscriberCount())
    await new Promise((r) => setTimeout(r, 50))
    expect(result.current[0]).toBe(5)
  })

  it('refresh(knownRemaining) updates state immediately without a fetch', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ remaining: 5 }) })
    const { result } = renderHook(() => useSubscriberCount())
    await waitFor(() => expect(result.current[0]).toBe(5))

    const [, refresh] = result.current
    refresh(2)
    await waitFor(() => expect(result.current[0]).toBe(2))
    expect(global.fetch).toHaveBeenCalledTimes(1) // only the initial call
  })
})
