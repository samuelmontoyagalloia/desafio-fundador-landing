import * as PhosphorIcons from '@phosphor-icons/react'
import { type FC } from 'react'
import { cn } from '../../../lib/utils'

type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'

type PhosphorIconComponent = FC<{
  size?: number | string
  weight?: PhosphorWeight
  color?: string
  className?: string
  'aria-label'?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}>

export type IconName = {
  [K in keyof typeof PhosphorIcons]: (typeof PhosphorIcons)[K] extends PhosphorIconComponent ? K : never
}[keyof typeof PhosphorIcons]

export interface IconProps {
  name: IconName
  weight?: PhosphorWeight
  size?: number
  color?: string
  className?: string
  'aria-label'?: string
  'aria-hidden'?: boolean
}

export function Icon({
  name,
  weight = 'regular',
  size = 24,
  color,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const IconComponent = PhosphorIcons[name] as PhosphorIconComponent | undefined
  if (!IconComponent) return null

  return (
    <IconComponent
      size={size}
      weight={weight}
      color={color}
      className={cn(className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (!ariaLabel ? true : undefined)}
    />
  )
}
