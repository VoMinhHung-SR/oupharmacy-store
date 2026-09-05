import type { SVGProps } from 'react'

/** Shared props for outline UI icons (Tabler-sourced paths, self-hosted). */
export type SvgIconProps = {
  className?: string
  size?: number
  /** Default 2 — match Tabler outline; override per call site if needed. */
  strokeWidth?: number
} & Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'strokeWidth' | 'ref'>
