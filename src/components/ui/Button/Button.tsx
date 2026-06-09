import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap uppercase leading-none',
    'border rounded-[6px] cursor-pointer select-none',
    'transition-colors duration-[160ms] ease-out',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-electric/20',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'font-display font-bold tracking-[0.12em]',
          'bg-electric text-cream border-transparent',
          'hover:bg-electric-deep active:bg-electric-deep active:translate-y-px',
        ].join(' '),
        secondary: [
          'font-body font-medium tracking-[0.15em]',
          'bg-transparent text-ink border-dust',
          'hover:border-ink active:border-ink active:bg-paper-warm active:translate-y-px',
        ].join(' '),
        ghost: [
          'font-body font-medium tracking-[0.15em]',
          'bg-transparent text-stone border-transparent',
          'hover:text-ink hover:bg-ink/[0.045] active:text-ink active:bg-ink/[0.085] active:translate-y-px',
        ].join(' '),
        danger: [
          'font-display font-bold tracking-[0.12em]',
          'bg-ink text-cream border-transparent',
          'hover:bg-black active:bg-black active:translate-y-px',
        ].join(' '),
      },
      size: {
        sm: 'text-[9px] px-4 py-[9px] min-h-[32px] gap-[6px]',
        md: 'text-[10px] px-[22px] py-3 min-h-[40px] gap-2',
        lg: 'text-[13px] px-[30px] py-4 min-h-[52px] gap-[10px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

const iconSize: Record<NonNullable<VariantProps<typeof buttonVariants>['size']>, string> = {
  sm: 'w-[12px] h-[12px]',
  md: 'w-[14px] h-[14px]',
  lg: 'w-[18px] h-[18px]',
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const Spinner = () => (
  <span
    aria-hidden="true"
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15px] h-[15px] border-[1.75px] border-current border-t-transparent rounded-full animate-spin"
  />
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    children,
    className,
    disabled,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading
  const icSize = iconSize[size ?? 'md']

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {leftIcon && (
        <span className={cn('flex-none flex items-center justify-center', icSize, loading && 'opacity-0')}>
          {leftIcon}
        </span>
      )}
      <span className={cn(loading && 'opacity-0')}>{children}</span>
      {rightIcon && (
        <span className={cn('flex-none flex items-center justify-center', icSize, loading && 'opacity-0')}>
          {rightIcon}
        </span>
      )}
      {loading && <Spinner />}
    </button>
  )
})
