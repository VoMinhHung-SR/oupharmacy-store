import { createOutlineIcon } from './createOutlineIcon'
import type { SvgIconProps } from './types'

/** Tabler: heart (MIT) — optional filled state for wishlist. */
export function HeartIcon({
  className = 'w-6 h-6',
  size,
  strokeWidth = 2,
  filled = false,
  ...rest
}: SvgIconProps & { filled?: boolean }) {
  if (filled) {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        data-icon="tabler:heart-filled"
        {...rest}
      >
        <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033l.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185l-.048.041l-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082l-7.493-7.422A6 6 0 0 1 6.979 3.074" />
      </svg>
    )
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-icon="tabler:heart"
      {...rest}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"
      />
    </svg>
  )
}

/** Tabler: shield-check (MIT) */
export const ShieldCheckIcon = createOutlineIcon('shield-check', [
  'M11.46 20.846A12 12 0 0 1 3.5 6A12 12 0 0 0 12 3a12 12 0 0 0 8.5 3a12 12 0 0 1-.09 7.06M15 19l2 2l4-4',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: shield (MIT) */
export const ShieldIcon = createOutlineIcon('shield', [
  'M12 3a12 12 0 0 0 8.5 3A12 12 0 0 1 12 21A12 12 0 0 1 3.5 6A12 12 0 0 0 12 3',
], { className: 'w-6 h-6', strokeWidth: 2 })
