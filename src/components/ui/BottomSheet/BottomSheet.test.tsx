import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BottomSheet } from './BottomSheet'

function TestSheet(props: Partial<Parameters<typeof BottomSheet>[0]>) {
  return (
    <BottomSheet
      isOpen={true}
      onClose={vi.fn()}
      title="Test Sheet"
      {...props}
    />
  )
}

describe('BottomSheet', () => {
  it('does not render when isOpen is false', () => {
    render(<BottomSheet isOpen={false} onClose={vi.fn()} title="Hidden" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    render(<TestSheet />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has correct ARIA attributes', () => {
    render(<TestSheet />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'bottom-sheet-title')
  })

  it('renders title', () => {
    render(<TestSheet title="Focus Session" />)
    expect(screen.getByText('Focus Session')).toBeInTheDocument()
  })

  it('renders drag handle', () => {
    const { container } = render(<TestSheet />)
    expect(container.querySelector('.rounded-full.bg-dust')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    const { container } = render(<TestSheet onClose={onClose} />)
    const presentation = container.querySelector('[role="presentation"]')!
    await userEvent.click(presentation)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn()
    render(<TestSheet onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders primaryAction button', () => {
    render(<TestSheet primaryAction={{ label: 'Start', onClick: vi.fn() }} />)
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  it('fires primaryAction onClick', async () => {
    const onClick = vi.fn()
    render(<TestSheet primaryAction={{ label: 'Go', onClick }} />)
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders destructive variant with danger primary and cancel ghost', () => {
    render(
      <TestSheet
        variant="destructive"
        primaryAction={{ label: 'Delete', onClick: vi.fn() }}
      />
    )
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('bg-ink')
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('renders expanded variant', () => {
    const { container } = render(<TestSheet variant="expanded"><p>Long content</p></TestSheet>)
    expect(container.querySelector('.top-10')).toBeInTheDocument()
  })

  it('renders children inside body', () => {
    render(<TestSheet><p>Sheet body content</p></TestSheet>)
    expect(screen.getByText('Sheet body content')).toBeInTheDocument()
  })
})
