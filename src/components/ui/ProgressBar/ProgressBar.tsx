import { type HTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

export type ProgressBarSize = 'slim' | 'standard'
export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error'

const fillColors: Record<ProgressBarVariant, string> = {
  default: 'bg-electric',
  success: 'bg-[oklch(0.56_0.13_150)]',
  warning: 'bg-[#C8860A]',
  error: 'bg-[oklch(0.57_0.19_27)]',
}

const sizeClasses: Record<ProgressBarSize, string> = {
  slim: 'h-[3px]',
  standard: 'h-[10px]',
}

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
  indeterminate?: boolean
  size?: ProgressBarSize
  variant?: ProgressBarVariant
  showLabel?: boolean
  label?: string
}

export function ProgressBar({
  value = 0,
  indeterminate = false,
  size = 'standard',
  variant = 'default',
  showLabel = false,
  label,
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const isStandard = size === 'standard'

  return (
    <div className={cn('w-full flex flex-col gap-[9px]', className)} {...props}>
      {(showLabel || label) && !indeterminate && (
        <div className="flex items-baseline justify-between">
          {label && <span className="font-body text-[13px] text-stone">{label}</span>}
          {showLabel && (
            <span className="font-body font-semibold text-[13px] text-ink tabular-nums">{clampedValue}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : 100}
        aria-label={label}
        aria-busy={indeterminate || undefined}
        className={cn(
          'relative w-full rounded-full overflow-hidden',
          'bg-[#E4DED4]',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full',
            fillColors[variant],
            indeterminate
              ? 'absolute top-0 left-0 w-[38%] animate-[indeterminate_1.5s_cubic-bezier(0.4,0,0.2,1)_infinite]'
              : 'transition-[width] duration-[800ms] ease-out'
          )}
          style={indeterminate ? undefined : { width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
