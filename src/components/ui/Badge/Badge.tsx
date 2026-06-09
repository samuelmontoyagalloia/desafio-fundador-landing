import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../lib/utils'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'
export type BadgeStyle = 'filled' | 'subtle' | 'outline'
export type BadgeSize = 'sm' | 'md'

const semanticClasses: Record<BadgeVariant, Record<BadgeStyle, string>> = {
  default: {
    filled: 'bg-ink text-cream border-ink',
    subtle: 'bg-paper-warm text-[#57534E] border-paper-warm',
    outline: 'border-dust text-[#57534E] bg-transparent',
  },
  success: {
    filled: 'bg-[oklch(0.56_0.13_150)] text-cream border-[oklch(0.56_0.13_150)]',
    subtle: 'bg-[oklch(0.95_0.045_150)] text-[oklch(0.43_0.12_150)] border-[oklch(0.95_0.045_150)]',
    outline: 'border-[oklch(0.80_0.09_150)] text-[oklch(0.43_0.12_150)] bg-transparent',
  },
  warning: {
    filled: 'bg-[#C8860A] text-ink border-[#C8860A]',
    subtle: 'bg-[oklch(0.95_0.055_80)] text-[oklch(0.47_0.10_80)] border-[oklch(0.95_0.055_80)]',
    outline: 'border-[oklch(0.82_0.10_80)] text-[oklch(0.47_0.10_80)] bg-transparent',
  },
  error: {
    filled: 'bg-[oklch(0.57_0.19_27)] text-cream border-[oklch(0.57_0.19_27)]',
    subtle: 'bg-[oklch(0.95_0.05_27)] text-[oklch(0.49_0.18_27)] border-[oklch(0.95_0.05_27)]',
    outline: 'border-[oklch(0.82_0.13_27)] text-[oklch(0.49_0.18_27)] bg-transparent',
  },
  info: {
    filled: 'bg-electric text-cream border-electric',
    subtle: 'bg-[oklch(0.95_0.045_258)] text-[oklch(0.48_0.17_258)] border-[oklch(0.95_0.045_258)]',
    outline: 'border-[oklch(0.80_0.12_258)] text-[oklch(0.48_0.17_258)] bg-transparent',
  },
}

const sizeClasses: Record<BadgeSize, string> = {
  md: 'text-[11px] px-[10px] py-[5px] gap-[5px] [&_svg]:w-[13px] [&_svg]:h-[13px]',
  sm: 'text-[9.5px] px-[7px] py-[3px] gap-[4px] [&_svg]:w-[11px] [&_svg]:h-[11px]',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  badgeStyle?: BadgeStyle
  size?: BadgeSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Badge({
  variant = 'default',
  badgeStyle = 'filled',
  size = 'md',
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-body font-semibold tracking-[0.06em] uppercase leading-none whitespace-nowrap',
        'border rounded-[5px]',
        semanticClasses[variant][badgeStyle],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {leftIcon && <span className="flex-none flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-none flex items-center">{rightIcon}</span>}
    </span>
  )
}
