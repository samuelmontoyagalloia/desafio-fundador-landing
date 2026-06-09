import {
  useEffect,
  useRef,
  type ReactNode,
  type MouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { cn } from '../../../lib/utils'
import { Button, type ButtonProps } from '../Button/Button'

export type ModalVariant = 'informational' | 'confirmation' | 'destructive' | 'form'

export interface ModalAction {
  label: string
  onClick: () => void
  loading?: boolean
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  variant?: ModalVariant
  title: string
  description?: string
  children?: ReactNode
  primaryAction?: ModalAction
  secondaryAction?: ModalAction
  className?: string
}

function useFocusTrap(ref: React.RefObject<HTMLElement | null>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return

    const el = ref.current
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    first?.focus()

    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (focusable.length === 0) { e.preventDefault(); return }
      if (e.shiftKey) {
        if (document.activeElement === first) { last?.focus(); e.preventDefault() }
      } else {
        if (document.activeElement === last) { first?.focus(); e.preventDefault() }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isActive, ref])
}

export function Modal({
  isOpen,
  onClose,
  variant = 'informational',
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  useFocusTrap(modalRef, isOpen)

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

  const primaryVariant: ButtonProps['variant'] = variant === 'destructive' ? 'danger' : 'primary'

  function handleBackdrop(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  const titleId = 'modal-title'
  const descId = 'modal-desc'

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={handleBackdrop}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-ink/[0.42]" />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description || children ? descId : undefined}
        className={cn(
          'relative z-10 w-[480px] max-w-full max-h-[90vh]',
          'bg-cream border border-[#B0AAA0] rounded-[14px]',
          'flex flex-col overflow-hidden',
          className
        )}
      >
        <div className={cn('flex-none flex items-start justify-between gap-4 px-[26px] pt-[26px] pb-4', (children || description) && 'border-b border-dust pb-[18px]')}>
          <h2 id={titleId} className="font-display font-bold text-[21px] tracking-[-0.01em] leading-[1.2] text-ink">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="flex-none w-[30px] h-[30px] -mt-1 -mr-1 inline-flex items-center justify-center border-none bg-transparent text-stone rounded-[6px] cursor-pointer transition-colors duration-[160ms] ease-out hover:text-ink hover:bg-ink/5"
          >
            <svg className="w-[17px] h-[17px] stroke-current fill-none stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {(description || children) && (
          <div id={descId} className="flex-1 min-h-0 overflow-y-auto px-[26px] py-[20px] [scrollbar-width:thin]">
            {description && (
              <p className="m-0 text-[14.5px] leading-[1.7] text-stone">{description}</p>
            )}
            {children}
          </div>
        )}

        {(primaryAction || secondaryAction) && (
          <div className={cn('flex-none flex items-center justify-end gap-[10px] px-[26px] py-[18px] bg-cream', (description || children) && 'border-t border-dust')}>
            {secondaryAction && (
              <Button variant="secondary" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant={primaryVariant}
                onClick={primaryAction.onClick}
                loading={primaryAction.loading}
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
