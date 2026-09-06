import type { SVGProps } from 'react'

/** Shared props for outline UI icons (self-hosted outline paths). */
export type SvgIconProps = {
  className?: string
  size?: number
  /** Default 2 — override per call site if needed. */
  strokeWidth?: number
} & Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'strokeWidth' | 'ref'>
