import { type HTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

const cardVariants = cva(
  'bg-cream border border-dust flex flex-col overflow-hidden',
  {
    variants: {
      variant: {
        base: '',
        featured: 'bg-ink border-ink',
        accent: 'border-l-[3px]',
      },
      accentColor: {
        blue: 'border-l-electric',
        amber: 'border-l-[#C8860A]',
        ink: 'border-l-ink',
      },
    },
    defaultVariants: {
      variant: 'base',
    },
  }
)

export interface CardProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof cardVariants> {
  as?: 'article' | 'div' | 'section'
}

export function Card({ variant = 'base', accentColor, className, as: Tag = 'article', children, ...props }: CardProps) {
  return (
    <Tag className={cn(cardVariants({ variant, accentColor }), 'relative', className)} {...props}>
      {variant === 'featured' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 w-[220px] h-[200px] bg-[radial-gradient(circle_at_100%_0%,rgba(0,102,255,0.20)_0%,transparent_62%)]"
        />
      )}
      {children}
    </Tag>
  )
}

export function CardMedia({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'aspect-video border-b border-dust flex items-center justify-center',
        'bg-[repeating-linear-gradient(135deg,var(--color-paper-warm)_0_11px,var(--color-cream)_11px_22px)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-[30px] flex flex-col gap-[13px] flex-1', className)} {...props}>
      {children}
    </div>
  )
}

export function CardIcon({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('w-[46px] h-[46px] border border-dust text-electric flex items-center justify-center mb-[3px]', className)}
      {...props}
    >
      {children}
    </span>
  )
}

export function CardCategory({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('font-body font-medium text-[9px] tracking-[0.32em] uppercase text-electric', className)}
      {...props}
    >
      {children}
    </span>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display font-bold text-[20px] tracking-[-0.01em] leading-[1.18] text-ink m-0', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardText({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('font-body font-light text-[14px] leading-[1.7] text-stone m-0', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between gap-3 mt-[5px] pt-[15px] border-t border-dust', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardMetadata({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('font-mono text-[10px] tracking-[0.04em] text-stone', className)}
      {...props}
    >
      {children}
    </span>
  )
}

interface CardActionProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  rightIcon?: ReactNode
}

export function CardAction({ className, children, rightIcon, ...props }: CardActionProps) {
  return (
    <a
      className={cn(
        'inline-flex items-center gap-[7px] font-display font-bold text-[10px] tracking-[0.12em] uppercase',
        'text-electric no-underline transition-colors duration-[160ms] ease-out hover:text-electric-deep',
        className
      )}
      {...props}
    >
      {children}
      {rightIcon}
    </a>
  )
}

Card.Media = CardMedia
Card.Body = CardBody
Card.Icon = CardIcon
Card.Category = CardCategory
Card.Title = CardTitle
Card.Text = CardText
Card.Footer = CardFooter
Card.Metadata = CardMetadata
Card.Action = CardAction
