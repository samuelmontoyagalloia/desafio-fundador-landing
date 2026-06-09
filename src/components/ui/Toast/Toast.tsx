import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '../../../lib/utils'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id?: string
  variant?: ToastVariant
  title: string
  message?: string
  action?: { label: string; onClick: () => void }
  duration?: number
  onClose?: () => void
  className?: string
}

const variantConfig: Record<
  ToastVariant,
  { borderColor: string; iconColor: string; icon: ReactNode }
> = {
  success: {
    borderColor: 'border-l-[oklch(0.56_0.13_150)]',
    iconColor: 'text-[oklch(0.56_0.13_150)]',
    icon: (
      <svg className="w-[20px] h-[20px] stroke-current fill-none stroke-[1.9] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  error: {
    borderColor: 'border-l-[oklch(0.57_0.19_27)]',
    iconColor: 'text-[oklch(0.57_0.19_27)]',
    icon: (
      <svg className="w-[20px] h-[20px] stroke-current fill-none stroke-[1.9] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
  },
  warning: {
    borderColor: 'border-l-[#C8860A]',
    iconColor: 'text-[#C8860A]',
    icon: (
      <svg className="w-[20px] h-[20px] stroke-current fill-none stroke-[1.9] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
  },
  info: {
    borderColor: 'border-l-electric',
    iconColor: 'text-electric',
    icon: (
      <svg className="w-[20px] h-[20px] stroke-current fill-none stroke-[1.9] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
}

export function Toast({
  variant = 'info',
  title,
  message,
  action,
  duration = 4000,
  onClose,
  className,
}: ToastProps) {
  const config = variantConfig[variant]
  const hasMessage = !!message

  useEffect(() => {
    if (!onClose || duration === 0) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'relative flex items-start gap-[13px]',
        'min-w-[320px] max-w-[480px] w-max',
        'px-4 pt-[15px] pr-[16px] pb-[15px] pl-[17px]',
        'bg-cream border border-dust border-l-[3px] rounded-[10px]',
        config.borderColor,
        !hasMessage && 'items-center',
        className
      )}
    >
      <span className={cn('flex-none w-[22px] h-[22px] mt-[1px] inline-flex items-center justify-center', config.iconColor, !hasMessage && 'mt-0')}>
        {config.icon}
      </span>

      <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
        <div className="font-display font-bold text-[14.5px] tracking-[-0.005em] leading-[1.3] text-ink whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </div>
        {message && (
          <p className="font-body text-[13px] leading-[1.55] text-stone m-0">
            {message}
          </p>
        )}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-[9px] self-start font-display font-bold text-[10px] tracking-[0.1em] uppercase bg-none border-none border-b border-b-current p-0 pb-[1px] cursor-pointer transition-[border-color] duration-[160ms] ease-out"
            style={{ color: 'var(--color-electric)', borderBottomColor: 'color-mix(in oklch, var(--color-electric) 35%, transparent)' }}
          >
            {action.label}
          </button>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          aria-label="Close notification"
          onClick={onClose}
          className="flex-none w-[24px] h-[24px] -mt-[3px] -mr-[3px] ml-[2px] inline-flex items-center justify-center border-none bg-transparent text-stone rounded-[6px] cursor-pointer transition-colors duration-[160ms] ease-out hover:text-ink hover:bg-ink/5"
        >
          <svg className="w-[15px] h-[15px] stroke-current fill-none stroke-[1.9] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string
}

interface ToastContextValue {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => string
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

function ToastStack({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null
  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 items-end"
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={() => onRemove(t.id)} />
      ))}
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>): string => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastStack toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return { toast: ctx.addToast, dismiss: ctx.removeToast, toasts: ctx.toasts }
}
