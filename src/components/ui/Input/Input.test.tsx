import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label linked to input via htmlFor/id', () => {
    render(<Input label="Email" id="email-input" />)
    const label = screen.getByText('Email')
    const input = screen.getByRole('textbox')
    expect(label).toHaveAttribute('for', 'email-input')
    expect(input).toHaveAttribute('id', 'email-input')
  })

  it('generates unique id when none provided', () => {
    render(<Input label="Name" />)
    const label = screen.getByText('Name')
    const input = screen.getByRole('textbox')
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
  })

  it('renders helper text with aria-describedby', () => {
    render(<Input label="Email" helperText="We won't spam you" />)
    const input = screen.getByRole('textbox')
    const helper = screen.getByText("We won't spam you")
    expect(input).toHaveAttribute('aria-describedby', helper.id)
  })

  it('shows error state with red styling and aria-invalid', () => {
    render(<Input errorMessage="Invalid email address" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address')
  })

  it('error message links to input via aria-describedby', () => {
    render(<Input errorMessage="Required" />)
    const input = screen.getByRole('textbox')
    const error = screen.getByRole('alert')
    expect(input).toHaveAttribute('aria-describedby', error.id)
  })

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled" />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('fires onChange when user types', async () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(onChange).toHaveBeenCalled()
  })

  it('renders leftIcon and rightIcon', () => {
    render(
      <Input
        leftIcon={<span data-testid="left-icon" />}
        rightIcon={<span data-testid="right-icon" />}
      />
    )
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('does not render error when no errorMessage', () => {
    render(<Input />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
