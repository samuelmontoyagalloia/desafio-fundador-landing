import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('renders with default props', () => {
    render(<ProgressBar />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow, aria-valuemin, aria-valuemax for determinate', () => {
    render(<ProgressBar value={50} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '50')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('clamps value between 0 and 100', () => {
    const { rerender } = render(<ProgressBar value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')

    rerender(<ProgressBar value={-10} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('renders standard size by default', () => {
    render(<ProgressBar />)
    expect(screen.getByRole('progressbar')).toHaveClass('h-[10px]')
  })

  it('renders slim size', () => {
    render(<ProgressBar size="slim" />)
    expect(screen.getByRole('progressbar')).toHaveClass('h-[3px]')
  })

  it('renders indeterminate mode with aria-busy', () => {
    render(<ProgressBar indeterminate />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-busy', 'true')
    expect(bar).not.toHaveAttribute('aria-valuenow')
  })

  it('renders label text when provided', () => {
    render(<ProgressBar value={75} showLabel label="Uploading..." />)
    expect(screen.getByText('Uploading...')).toBeInTheDocument()
  })

  it('renders percentage label when showLabel is true', () => {
    render(<ProgressBar value={60} showLabel />)
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('renders all determinate variants', () => {
    const { container, rerender } = render(<ProgressBar variant="default" value={50} />)
    expect(container.querySelector('.bg-electric')).toBeInTheDocument()

    rerender(<ProgressBar variant="success" value={50} />)
    expect(container.querySelector('.bg-\\[oklch\\(0\\.56_0\\.13_150\\)\\]')).toBeInTheDocument()

    rerender(<ProgressBar variant="warning" value={50} />)
    expect(container.querySelector('.bg-\\[\\#C8860A\\]')).toBeInTheDocument()

    rerender(<ProgressBar variant="error" value={50} />)
    expect(container.querySelector('.bg-\\[oklch\\(0\\.57_0\\.19_27\\)\\]')).toBeInTheDocument()
  })

  it('has pill border radius', () => {
    render(<ProgressBar />)
    expect(screen.getByRole('progressbar')).toHaveClass('rounded-full')
  })
})
