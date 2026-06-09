import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders with default props', () => {
    render(<Textarea placeholder="Enter text" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label linked to textarea', () => {
    render(<Textarea label="Message" id="msg" />)
    const label = screen.getByText('Message')
    const textarea = screen.getByRole('textbox')
    expect(label).toHaveAttribute('for', 'msg')
    expect(textarea).toHaveAttribute('id', 'msg')
  })

  it('applies rows prop', () => {
    render(<Textarea rows={6} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6')
  })

  it('renders helper text with aria-describedby', () => {
    render(<Textarea helperText="Max 500 characters" />)
    const textarea = screen.getByRole('textbox')
    const helper = screen.getByText('Max 500 characters')
    expect(textarea).toHaveAttribute('aria-describedby', helper.id)
  })

  it('shows error state with aria-invalid', () => {
    render(<Textarea errorMessage="Too short" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Too short')
  })

  it('handles disabled state', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('fires onChange on input', async () => {
    const onChange = vi.fn()
    render(<Textarea onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(onChange).toHaveBeenCalled()
  })

  it('has vertical resize only', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toHaveClass('resize-y')
  })
})
