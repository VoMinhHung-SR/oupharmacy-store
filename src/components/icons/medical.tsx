import { createOutlineIcon } from './createOutlineIcon'
import type { SvgIconProps } from './types'

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
        data-icon="heart-filled"
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
      data-icon="heart"
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

export const ShieldCheckIcon = createOutlineIcon('shield-check', [
  'M11.46 20.846A12 12 0 0 1 3.5 6A12 12 0 0 0 12 3a12 12 0 0 0 8.5 3a12 12 0 0 1-.09 7.06M15 19l2 2l4-4',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const ShieldIcon = createOutlineIcon('shield', [
  'M12 3a12 12 0 0 0 8.5 3A12 12 0 0 1 12 21A12 12 0 0 1 3.5 6A12 12 0 0 0 12 3',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const HeartbeatIcon = createOutlineIcon('heartbeat', [
  'M19.5 13.572L12 21l-2.896-2.868m-6.117-8.104A5 5 0 0 1 12 7.006a5 5 0 1 1 7.5 6.572',
  'M3 13h2l2 3l2-6l1 3h3',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const LungsIcon = createOutlineIcon('lungs', [
  'M6.081 20C7.693 20 9 18.665 9 17.02V7.257C9 6.563 8.448 6 7.768 6c-.205 0-.405.052-.584.15l-.13.083C5.594 7.292 4.622 8.88 3.65 12.057q-.63 2.055-.648 4.775c-.012 1.675 1.261 3.054 2.877 3.161zm11.839 0C16.307 20 15 18.665 15 17.02V7.257C15 6.563 15.552 6 16.233 6c.204 0 .405.052.584.15l.13.083c1.46 1.059 2.432 2.647 3.405 5.824q.63 2.055.648 4.775c.012 1.675-1.261 3.054-2.878 3.161zM9 12a3 3 0 0 0 3-3a3 3 0 0 0 3 3m-3-8v5',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const BrainIcon = createOutlineIcon('brain', [
  'M15.5 13a3.5 3.5 0 0 0-3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1-7 0v-1.8',
  'M17.5 16a3.5 3.5 0 0 0 0-7H17',
  'M19 9.3V6.5a3.5 3.5 0 0 0-7 0M6.5 16a3.5 3.5 0 0 1 0-7H7',
  'M5 9.3V6.5a3.5 3.5 0 0 1 7 0v10',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const BoneIcon = createOutlineIcon('bone', [
  'M15 3a3 3 0 0 1 3 3a3 3 0 1 1-2.12 5.122l-4.758 4.758a3 3 0 1 1-5.117 2.297V18h-.176a3 3 0 1 1 2.298-5.115l4.758-4.758a3 3 0 0 1 2.12-5.122z',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const DropletIcon = createOutlineIcon('droplet', [
  'M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0s3.262-5.708 1.566-8.546l-4.89-7.26c-.42-.625-1.287-.803-1.936-.397a1.4 1.4 0 0 0-.41.397l-4.893 7.26C4.24 13.715 4.9 17.318 7.502 19.423',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const EarIcon = createOutlineIcon('ear', [
  'M6 10a7 7 0 1 1 13 3.6a10 10 0 0 1-2 2a8 8 0 0 0-2 3A4.5 4.5 0 0 1 8.2 20',
  'M10 10a3 3 0 1 1 5 2.2',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const VirusIcon = createOutlineIcon('virus', [
  'M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0m5-5V3m-1 0h2m2.536 5.464l2.828-2.828m-.707-.707l1.414 1.414M17 12h4m0-1v2m-5.465 2.536l2.829 2.828m.707-.707l-1.414 1.414M12 17v4m1 0h-2m-2.535-5.464l-2.829 2.828m.707.707L4.93 17.657M7 12H3m0 1v-2m5.464-2.536L5.636 5.636m-.707.707L6.343 4.93',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const DnaIcon = createOutlineIcon('dna', [
  'M14.828 14.828a4 4 0 1 0-5.656-5.656a4 4 0 0 0 5.656 5.656',
  'M9.172 20.485a4 4 0 1 0-5.657-5.657M14.828 3.515a4 4 0 0 0 5.657 5.657',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const ActivityIcon = createOutlineIcon('activity', [
  'M3 12h4l3 8l4-16l3 8h4',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const PlantIcon = createOutlineIcon('plant', [
  'M7 15h10v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zm5-6a6 6 0 0 0-6-6H3v2a6 6 0 0 0 6 6h3m0 0a6 6 0 0 1 6-6h3v1a6 6 0 0 1-6 6h-3m0 3V9',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const ScissorsIcon = createOutlineIcon('scissors', [
  'M3 7a3 3 0 1 0 6 0a3 3 0 1 0-6 0m0 10a3 3 0 1 0 6 0a3 3 0 1 0-6 0m5.6-8.4L19 19M8.6 15.4L19 5',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const MedicalCrossIcon = createOutlineIcon('medical-cross', [
  'M13 3a1 1 0 0 1 1 1v4.535l3.928-2.267a1 1 0 0 1 1.366.366l1 1.732a1 1 0 0 1-.366 1.366L16.001 12l3.927 2.269a1 1 0 0 1 .366 1.366l-1 1.732a1 1 0 0 1-1.366.366L14 15.464V20a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-4.536l-3.928 2.268a1 1 0 0 1-1.366-.366l-1-1.732a1 1 0 0 1 .366-1.366L7.999 12L4.072 9.732a1 1 0 0 1-.366-1.366l1-1.732a1 1 0 0 1 1.366-.366L10 8.535V4a1 1 0 0 1 1-1z',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const StethoscopeIcon = createOutlineIcon('stethoscope', [
  'M6 4H5a2 2 0 0 0-2 2v3.5a5.5 5.5 0 0 0 11 0V6a2 2 0 0 0-2-2h-1',
  'M8 15a6 6 0 1 0 12 0v-3m-9-9v2M6 3v2',
  'M18 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
], { className: 'w-6 h-6', strokeWidth: 2 })

export const BodyScanIcon = createOutlineIcon('body-scan', [
  'M11 8a1 1 0 1 0 2 0a1 1 0 0 0-2 0m-1 9v-1a2 2 0 1 1 4 0v1m-6-7q1 1 2 1h4q1 0 2-1m-4 1v3M3 7V5a2 2 0 0 1 2-2h2M3 17v2a2 2 0 0 0 2 2h2M17 3h2a2 2 0 0 1 2 2v2m-4 14h2a2 2 0 0 0 2-2v-2',
], { className: 'w-6 h-6', strokeWidth: 2 })
