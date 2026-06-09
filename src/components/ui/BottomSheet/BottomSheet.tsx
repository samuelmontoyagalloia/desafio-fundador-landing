import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '../../../lib/utils'
import { Button } from '../Button/Button'

export type BottomSheetVariant = 'default' | 'expanded' | 'destructive'

export interface BottomSheetAction {
  label: string
  onClick: () => void
  loading?: boolean
}

export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  variant?: BottomSheetVariant
  title: string
  children?: ReactNode
  primaryAction?: BottomSheetAction
  className?: string
}

export function BottomSheet({
  isOpen,
  onClose,
  variant = 'default',
  title,
  children,
  primaryAction,
  className,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isExpanded = variant === 'expanded'
  const isDestructive = variant === 'destructive'
  const primaryVariant = isDestructive ? 'danger' : 'primary'
  const titleId = 'bottom-sheet-title'

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-ink/[0.42]" />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'absolute left-0 right-0 bottom-0 z-10',
          'bg-cream border-t border-[#B0AAA0]',
          'rounded-t-[14px]',
          'flex flex-col overflow-hidden',
          isExpanded ? 'top-10' : 'max-h-[60vh]',
          className
        )}
      >
        <div className="flex-none flex justify-center pt-[10px] pb-[2px]">
          <span aria-hidden="true" className="w-[38px] h-[4px] rounded-full bg-dust block" />
        </div>

        <div className={cn('flex-none px-[22px] pb-[14px] pt-3', isExpanded && 'border-b border-dust')}>
          <h2 id={titleId} className="font-display font-bold text-[20px] tracking-[-0.01em] leading-[1.2] text-ink">
            {title}
          </h2>
        </div>

        {children && (
          <div className={cn('flex-1 min-h-0 overflow-y-auto px-[22px] pb-[18px] [scrollbar-width:thin]', isExpanded && 'pt-4')}>
            {children}
          </div>
        )}

        {(primaryAction || isDestructive) && (
          <div className={cn('flex-none flex flex-col gap-2 px-[22px] pt-[14px] pb-[22px] bg-cream', isExpanded && 'border-t border-dust')}>
            {primaryAction && (
              <Button
                variant={primaryVariant}
                className="w-full"
                onClick={primaryAction.onClick}
                loading={primaryAction.loading}
              >
                {primaryAction.label}
              </Button>
            )}
            {isDestructive && (
              <Button variant="ghost" className="w-full" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
