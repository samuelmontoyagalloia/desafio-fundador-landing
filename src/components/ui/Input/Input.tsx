import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../lib/utils'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  errorMessage?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, errorMessage, leftIcon, rightIcon, className, id: idProp, disabled, ...props },
  ref
) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const helperId = `${id}-helper`
  const errorId = `${id}-error`
  const hasError = !!errorMessage

  const inputClasses = cn(
    'w-full font-body font-normal text-[15px] leading-[1.5] text-ink bg-cream',
    'border rounded-[6px] outline-none appearance-none',
    'placeholder:text-[#A8A29A]',
    'transition-[border-color,box-shadow] duration-[160ms] ease-out',
    leftIcon ? 'pl-10 pr-[14px]' : 'px-[14px]',
    rightIcon ? 'pr-10' : '',
    'py-3',
    hasError
      ? 'border-[oklch(0.57_0.19_27)] focus:border-[oklch(0.57_0.19_27)] focus:shadow-[0_0_0_3px_oklch(0.57_0.19_27_/_0.18)]'
      : 'border-dust focus:border-electric focus:shadow-[0_0_0_3px_rgba(0,102,255,0.16)]',
    disabled && 'bg-paper-warm text-stone border-dust cursor-not-allowed shadow-none placeholder:text-dust',
    className
  )

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="font-body font-medium text-[11px] tracking-[0.08em] uppercase text-ink"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] flex items-center justify-center text-stone">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] flex items-center justify-center text-stone">
            {rightIcon}
          </span>
        )}
      </div>
      {hasError ? (
        <p id={errorId} role="alert" className="flex items-start gap-[7px] font-body text-[12.5px] leading-[1.5] text-[oklch(0.49_0.18_27)]">
          <svg className="w-[14px] h-[14px] flex-none mt-[1px] stroke-current fill-none stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className={cn('font-body font-light text-[12.5px] leading-[1.5]', disabled ? 'text-dust' : 'text-stone')}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
})
