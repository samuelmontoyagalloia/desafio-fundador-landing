import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toast, ToastProvider, useToast } from './Toast'

describe('Toast', () => {
  it('renders with required props', () => {
    render(<Toast title="Saved successfully" />)
    expect(screen.getByText('Saved successfully')).toBeInTheDocument()
  })

  it('has role="alert"', () => {
    render(<Toast title="Alert" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders all variants', () => {
    const { rerender } = render(<Toast variant="success" title="Success" />)
    expect(screen.getByRole('alert')).toHaveClass('border-l-[oklch(0.56_0.13_150)]')

    rerender(<Toast variant="error" title="Error" />)
    expect(screen.getByRole('alert')).toHaveClass('border-l-[oklch(0.57_0.19_27)]')

    rerender(<Toast variant="warning" title="Warning" />)
    expect(screen.getByRole('alert')).toHaveClass('border-l-[#C8860A]')

    rerender(<Toast variant="info" title="Info" />)
    expect(screen.getByRole('alert')).toHaveClass('border-l-electric')
  })

  it('renders message when provided', () => {
    render(<Toast title="Title" message="This is a message" />)
    expect(screen.getByText('This is a message')).toBeInTheDocument()
  })

  it('renders action button when provided', () => {
    render(<Toast title="Deleted" action={{ label: 'Undo', onClick: vi.fn() }} />)
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
  })

  it('fires action onClick', async () => {
    const onClick = vi.fn()
    render(<Toast title="Deleted" action={{ label: 'Undo', onClick }} />)
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    render(<Toast title="Info" onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /close notification/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('auto-dismisses after duration', async () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    render(<Toast title="Timed" duration={1000} onClose={onClose} />)
    expect(onClose).not.toHaveBeenCalled()
    act(() => { vi.advanceTimersByTime(1000) })
    expect(onClose).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })

  it('does not auto-dismiss when duration is 0', async () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    render(<Toast title="Persistent" duration={0} onClose={onClose} />)
    act(() => { vi.advanceTimersByTime(10000) })
    expect(onClose).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})

describe('ToastProvider + useToast', () => {
  function ToastTrigger() {
    const { toast } = useToast()
    return (
      <button
        type="button"
        onClick={() => toast({ variant: 'success', title: 'Done!' })}
      >
        Show Toast
      </button>
    )
  }

  it('adds and displays a toast via useToast', async () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    expect(screen.getByText('Done!')).toBeInTheDocument()
  })

  it('throws when useToast is used outside provider', () => {
    const orig = console.error
    console.error = vi.fn()
    expect(() => render(<ToastTrigger />)).toThrow()
    console.error = orig
  })
})
