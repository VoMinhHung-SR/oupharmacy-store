import { createOutlineIcon } from './createOutlineIcon'
import type { SvgIconProps } from './types'

/** Tabler: search (MIT) */
export const SearchIcon = createOutlineIcon('search', ['M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6'], { className: 'w-4 h-4', strokeWidth: 2 })

/** Tabler: layout-grid (MIT) */
export const GridIcon = createOutlineIcon('layout-grid', ['M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: layout-list (MIT) */
export const ListIcon = createOutlineIcon('layout-list', ['M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm0 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: chevron-down (MIT) — supports `rotated` for expand/collapse affordance. */
export function ChevronDownIcon({
  className = 'w-5 h-5',
  size,
  strokeWidth = 2,
  rotated = false,
  ...rest
}: SvgIconProps & { rotated?: boolean }) {
  return (
    <svg
      className={`${className} transition-transform ${rotated ? 'rotate-180' : ''}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-icon="tabler:chevron-down"
      {...rest}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="m6 9l6 6l6-6"
      />
    </svg>
  )
}

/** Tabler: chevron-up (MIT) */
export const ChevronUpIcon = createOutlineIcon('chevron-up', ['m6 15l6-6l6 6'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: chevron-left (MIT) */
export const ChevronLeftIcon = createOutlineIcon('chevron-left', ['m15 6l-6 6l6 6'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: chevron-right (MIT) */
export const ChevronRightIcon = createOutlineIcon('chevron-right', ['m9 6l6 6l-6 6'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: chevrons-down (MIT) */
export const ChevronDoubleDownIcon = createOutlineIcon('chevrons-down', ['m7 7l5 5l5-5M7 13l5 5l5-5'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: check (MIT) */
export const CheckIcon = createOutlineIcon('check', ['m5 12l5 5L20 7'], { className: 'w-4 h-4', strokeWidth: 2 })

/** Tabler: circle-check (MIT) */
export const CheckCircleIcon = createOutlineIcon('circle-check', ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0', 'm9 12l2 2l4-4'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: circle-x (MIT) */
export const XCircleIcon = createOutlineIcon('circle-x', ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m7-2l4 4m0-4l-4 4'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: microphone (MIT) */
export const MicIcon = createOutlineIcon('microphone', ['M9 5a3 3 0 0 1 3-3a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3a3 3 0 0 1-3-3z', 'M5 10a7 7 0 0 0 14 0M8 21h8m-4-4v4'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: scan (MIT) */
export const QrScanIcon = createOutlineIcon('scan', ['M5 12h14M3 7V5a2 2 0 0 1 2-2h2M3 17v2a2 2 0 0 0 2 2h2M17 3h2a2 2 0 0 1 2 2v2m-4 14h2a2 2 0 0 0 2-2v-2'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: x (MIT) */
export const CloseIcon = createOutlineIcon('x', ['M18 6L6 18M6 6l12 12'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: x (MIT) */
export const XIcon = createOutlineIcon('x', ['M18 6L6 18M6 6l12 12'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: menu-2 (MIT) */
export const MenuIcon = createOutlineIcon('menu-2', ['M4 6h16M4 12h16M4 18h16'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: filter (MIT) */
export const FilterIcon = createOutlineIcon('filter', ['M4 4h16v2.172a2 2 0 0 1-.586 1.414L15 12v7l-6 2v-8.5L4.52 7.572A2 2 0 0 1 4 6.227z'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: arrow-left (MIT) */
export const ArrowLeftIcon = createOutlineIcon('arrow-left', ['M5 12h14M5 12l6 6m-6-6l6-6'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: info-circle (MIT) */
export const InfoIcon = createOutlineIcon('info-circle', ['M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0m9-3h.01', 'M11 12h1v4h1'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: plus (MIT) */
export const PlusIcon = createOutlineIcon('plus', ['M12 5v14m-7-7h14'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: minus (MIT) */
export const MinusIcon = createOutlineIcon('minus', ['M5 12h14'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: share (MIT) */
export const ShareIcon = createOutlineIcon('share', ['M3 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m12-6a3 3 0 1 0 6 0a3 3 0 1 0-6 0m0 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m-6.3-7.3l6.6-3.4m-6.6 6l6.6 3.4'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: copy (MIT) */
export const CopyIcon = createOutlineIcon('copy', ['M7 9.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333z', 'M4.012 16.737A2 2 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: bolt (MIT) */
export const BoltIcon = createOutlineIcon('bolt', ['M13 3v7h6l-8 11v-7H5z'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: file-text (MIT) */
export const FileTextIcon = createOutlineIcon('file-text', ['M14 3v4a1 1 0 0 0 1 1h4', 'M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2M9 9h1m-1 4h6m-6 4h6'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: loader-2 (MIT) — add `animate-spin` via className at call site. */
export function SpinnerIcon({
  className = 'w-5 h-5',
  size,
  strokeWidth = 2,
  ...rest
}: SvgIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-icon="tabler:loader-2"
      {...rest}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 3a9 9 0 1 0 9 9"
      />
    </svg>
  )
}
