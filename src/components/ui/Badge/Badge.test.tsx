import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Label</Badge>)
    expect(screen.getByText('Label')).toBeInTheDocument()
  })

  it('renders all semantic variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toBeInTheDocument()

    rerender(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success')).toBeInTheDocument()

    rerender(<Badge variant="warning">Warning</Badge>)
    expect(screen.getByText('Warning')).toBeInTheDocument()

    rerender(<Badge variant="error">Error</Badge>)
    expect(screen.getByText('Error')).toBeInTheDocument()

    rerender(<Badge variant="info">Info</Badge>)
    expect(screen.getByText('Info')).toBeInTheDocument()
  })

  it('renders all styles', () => {
    const { rerender } = render(<Badge badgeStyle="filled">Filled</Badge>)
    expect(screen.getByText('Filled').className).toMatch(/bg-ink/)

    rerender(<Badge badgeStyle="subtle">Subtle</Badge>)
    expect(screen.getByText('Subtle').className).toMatch(/bg-paper-warm/)

    rerender(<Badge badgeStyle="outline">Outline</Badge>)
    expect(screen.getByText('Outline').className).toMatch(/bg-transparent/)
  })

  it('renders medium size by default', () => {
    render(<Badge>Medium</Badge>)
    expect(screen.getByText('Medium')).toHaveClass('text-[11px]')
  })

  it('renders small size', () => {
    render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText('Small')).toHaveClass('text-[9.5px]')
  })

  it('renders leftIcon and rightIcon', () => {
    render(
      <Badge
        leftIcon={<span data-testid="left-icon" />}
        rightIcon={<span data-testid="right-icon" />}
      >
        Content
      </Badge>
    )
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('is uppercase', () => {
    render(<Badge>Status</Badge>)
    expect(screen.getByText('Status')).toHaveClass('uppercase')
  })

  it('accepts custom className', () => {
    render(<Badge className="custom">Custom</Badge>)
    expect(screen.getByText('Custom')).toHaveClass('custom')
  })
})
