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

/** Tabler: droplets — https://icon-sets.iconify.design/tabler/droplets/ */
export const DropletsIcon = createOutlineIcon('droplets', [
  'M4.072 20.3a3 3 0 0 0 3.856 0a3 3 0 0 0 .67-3.798l-2.095-3.227a.6.6 0 0 0-1.005 0L3.4 16.502a3 3 0 0 0 .671 3.798m12.001 0a3 3 0 0 0 3.856 0a3 3 0 0 0 .67-3.798l-2.095-3.227a.6.6 0 0 0-1.005 0L15.4 16.502a3 3 0 0 0 .671 3.798m-5.999-10a3 3 0 0 0 3.856 0a3 3 0 0 0 .67-3.798l-2.095-3.227a.6.6 0 0 0-1.005 0L9.4 6.502a3 3 0 0 0 .671 3.798z',
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

/** Tabler: apple — https://icon-sets.iconify.design/tabler/apple/ */
export const AppleIcon = createOutlineIcon('apple', [
  'M4 11.319c0 3.102.444 5.319 2.222 7.978c1.351 1.797 3.156 2.247 5.08.988c.426-.268.97-.268 1.397 0c1.923 1.26 3.728.809 5.079-.988C19.556 16.637 20 14.421 20 11.32C20 8.659 18.01 6 15.556 6c-1.267 0-2.41.693-3.22 1.44a.5.5 0 0 1-.672 0C10.855 6.694 9.711 6 8.444 6C5.99 6 4 8.66 4 11.319',
  'M7 12c0-1.47.454-2.34 1.5-3M12 7c0-1.2.867-4 3-4',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: salad — https://icon-sets.iconify.design/tabler/salad/ */
export const SaladIcon = createOutlineIcon('salad', [
  'M4 11h16a1 1 0 0 1 1 1v.5c0 1.5-2.517 5.573-4 6.5v1a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-1c-1.687-1.054-4-5-4-6.5V12a1 1 0 0 1 1-1m14.5 0c.351-1.017.426-2.236.5-3.714V6h-2.256c-2.83 0-4.616.804-5.64 2.076',
  'M5.255 11.008A12 12 0 0 1 5 9V8h1.755c.98 0 1.801.124 2.479.35M8 8l1-4l4 2.5',
  'M13 11v-.5a2.5 2.5 0 1 0-5 0v.5',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: soup — https://icon-sets.iconify.design/tabler/soup/ */
export const SoupIcon = createOutlineIcon('soup', [
  'M4 11h16a1 1 0 0 1 1 1v.5c0 1.5-2.517 5.573-4 6.5v1a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-1c-1.687-1.054-4-5-4-6.5V12a1 1 0 0 1 1-1m8-7a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2m4-4a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2M8 4a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2',
], { className: 'w-6 h-6', strokeWidth: 2 })

/**
 * Hugeicons: digestion — https://icon-sets.iconify.design/hugeicons/digestion/
 * (digestive organ / gut — used for “Hỗ trợ tiêu hóa”)
 */
export const DigestionIcon = createOutlineIcon('digestion', [
  'M9.485 2c.243 1.49.956 2.574 2.99 1.872c4.202-1.451 7.524 2.977 7.524 6.928c0 3.976-2.646 7.2-5.91 7.2h-1.064c-2.533 0-4.75 1.632-5.572 4',
  'M6.006 2v.776c0 3.802 5.422 6.611 3.631 10.424C8.926 14.715 4.895 17.293 4 22M14 7a3.03 3.03 0 0 1 2 2',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: flask-2 — https://icon-sets.iconify.design/tabler/flask-2/ */
export const FlaskIcon = createOutlineIcon('flask-2', [
  'M6.1 15h11.8M14 3v7.342A6 6 0 0 1 15.318 21H8.683A6 6 0 0 1 10 10.34V3zM9 3h6',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: gender-bigender — https://icon-sets.iconify.design/tabler/gender-bigender/ */
export const GenderBigenderIcon = createOutlineIcon('gender-bigender', [
  'M7 11a4 4 0 1 0 8 0a4 4 0 1 0-8 0m12-8l-5 5m1-5h4v4m-8 9v6m-3-3h6',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: hearts — https://icon-sets.iconify.design/tabler/hearts/ */
export const HeartsIcon = createOutlineIcon('hearts', [
  'M14.017 18L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 0 1 8.153 5.784',
  'm15.99 20l4.197-4.223a2.81 2.81 0 0 0 0-3.948a2.747 2.747 0 0 0-3.91-.007l-.28.282l-.279-.283a2.747 2.747 0 0 0-3.91-.007a2.81 2.81 0 0 0-.007 3.948L15.983 20z',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: sparkles — https://icon-sets.iconify.design/tabler/sparkles/ */
export const SparklesIcon = createOutlineIcon('sparkles', [
  'M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2-2a2 2 0 0 1-2-2a2 2 0 0 1-2 2m0-12a2 2 0 0 1 2 2a2 2 0 0 1 2-2a2 2 0 0 1-2-2a2 2 0 0 1-2 2M9 18a6 6 0 0 1 6-6a6 6 0 0 1-6-6a6 6 0 0 1-6 6a6 6 0 0 1 6 6',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: mood-smile — https://icon-sets.iconify.design/tabler/mood-smile/ */
export const MoodSmileIcon = createOutlineIcon('mood-smile', [
  'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m6-2h.01M15 10h.01',
  'M9.5 15a3.5 3.5 0 0 0 5 0',
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

/** Tabler: fish — https://icon-sets.iconify.design/tabler/fish/ */
export const FishIcon = createOutlineIcon('fish', [
  'M16.69 7.44A6.97 6.97 0 0 0 15 12a6.97 6.97 0 0 0 1.699 4.571',
  'M2 9.504c7.715 8.647 14.75 10.265 20 2.498C16.75 4.241 9.715 5.86 2 14.506M18 11v.01',
  'M11.5 10.5q-1 1.5 0 3',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: moon-stars — https://icon-sets.iconify.design/tabler/moon-stars/ */
export const MoonStarsIcon = createOutlineIcon('moon-stars', [
  'M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992zm5 1a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2m2 7h2m-1-1v2',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: mood-nervous — https://icon-sets.iconify.design/tabler/mood-nervous/ */
export const MoodNervousIcon = createOutlineIcon('mood-nervous', [
  'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m6-2h.01M15 10h.01',
  'm8 16l2-2l2 2l2-2l2 2',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: flame — https://icon-sets.iconify.design/tabler/flame/ */
export const FlameIcon = createOutlineIcon('flame', [
  'M12 10.941c2.333-3.308.167-7.823-1-8.941c0 3.395-2.235 5.299-3.667 6.706C5.903 10.114 5 12 5 14.294C5 17.998 8.134 21 12 21s7-3.002 7-6.706c0-1.712-1.232-4.403-2.333-5.588c-2.084 3.353-3.257 3.353-4.667 2.235',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: flower — https://icon-sets.iconify.design/tabler/flower/ */
export const FlowerIcon = createOutlineIcon('flower', [
  'M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  'M12 2a3 3 0 0 1 3 3q0 .843-.776 2.64L13.5 9l1.76-1.893q.748-.899 1.27-1.205a2.97 2.97 0 0 1 4.07 1.099a3.01 3.01 0 0 1-1.09 4.098q-.561.326-1.846.535L15 12l2.4.326c1 .145 1.698.337 2.11.576A3.01 3.01 0 0 1 20.6 17a2.97 2.97 0 0 1-4.07 1.098q-.522-.303-1.27-1.205L13.5 15l.724 1.36q.775 1.799.776 2.64a3 3 0 0 1-6 0q0-.843.776-2.64L10.5 15l-1.76 1.893q-.748.9-1.27 1.205A2.97 2.97 0 0 1 3.4 17a3.01 3.01 0 0 1 1.09-4.098q.561-.326 1.846-.536L9 12l-2.4-.325c-1-.145-1.698-.337-2.11-.576A3.01 3.01 0 0 1 3.4 7a2.97 2.97 0 0 1 4.07-1.099q.522.304 1.27 1.205L10.5 9Q9 5.562 9 5a3 3 0 0 1 3-3',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: scale — https://icon-sets.iconify.design/tabler/scale/ */
export const ScaleIcon = createOutlineIcon('scale', [
  'M7 20h10M6 6l6-1l6 1m-6-3v17m-3-8L6 6l-3 6a3 3 0 0 0 6 0m12 0l-3-6l-3 6a3 3 0 0 0 6 0',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: sun — https://icon-sets.iconify.design/tabler/sun/ */
export const SunIcon = createOutlineIcon('sun', [
  'M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: brightness-up — https://icon-sets.iconify.design/tabler/brightness-up/ */
export const BrightnessUpIcon = createOutlineIcon('brightness-up', [
  'M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m3-7V3m5 4l1.4-1.4M19 12h2m-4 5l1.4 1.4M12 19v2m-5-4l-1.4 1.4M6 12H4m3-5L5.6 5.6',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: thermometer — https://icon-sets.iconify.design/tabler/thermometer/ */
export const ThermometerIcon = createOutlineIcon('thermometer', [
  'M19 5a2.83 2.83 0 0 1 0 4l-8 8H7v-4l8-8a2.83 2.83 0 0 1 4 0m-3 2l-1.5-1.5M13 10l-1.5-1.5M10 13l-1.5-1.5M7 17l-3 3',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: toilet-paper — https://icon-sets.iconify.design/tabler/toilet-paper/ */
export const ToiletPaperIcon = createOutlineIcon('toilet-paper', [
  'M3 10a3 7 0 1 0 6 0a3 7 0 1 0-6 0m18 0c0-3.866-1.343-7-3-7M6 3h12m3 7v10l-3-1l-3 2l-3-3l-3 2V10m-3 0h.01',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: report-medical — https://icon-sets.iconify.design/tabler/report-medical/ */
export const ReportMedicalIcon = createOutlineIcon('report-medical', [
  'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2',
  'M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m1 9h4m-2-2v4',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: bed — https://icon-sets.iconify.design/tabler/bed/ */
export const BedIcon = createOutlineIcon('bed', [
  'M5 9a2 2 0 1 0 4 0a2 2 0 1 0-4 0m17 8v-3H2m0-6v9m10-3h10v-2a3 3 0 0 0-3-3h-7z',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: physiotherapist — https://icon-sets.iconify.design/tabler/physiotherapist/ */
export const PhysiotherapistIcon = createOutlineIcon('physiotherapist', [
  'm9 15l-1-3l4-2l4 1h3.5M3 19a1 1 0 1 0 2 0a1 1 0 1 0-2 0m8-13a1 1 0 1 0 2 0a1 1 0 1 0-2 0m1 11v-7M8 20h7l1-4l4-2m-2 6h3',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: massage — https://icon-sets.iconify.design/tabler/massage/ */
export const MassageIcon = createOutlineIcon('massage', [
  'M3 17a1 1 0 1 0 2 0a1 1 0 1 0-2 0M8 5a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 22l4-2v-3h12m-9 3h9M8 14l3-2l1-4c3 1 3 4 3 6',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: virus-search — https://icon-sets.iconify.design/tabler/virus-search/ */
export const VirusSearchIcon = createOutlineIcon('virus-search', [
  'M17 12a5 5 0 1 0-5 5m0-10V3m-1 0h2m2.536 5.464l2.828-2.828m-.707-.707l1.414 1.414M17 12h4m0-1v2m-9 4v4m1 0h-2m-2.535-5.464l-2.829 2.828m.707.707L4.93 17.657M7 12H3m0 1v-2m5.464-2.536L5.636 5.636m-.707.707L6.343 4.93M15 17.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0m4.5 2L22 22',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: ban — https://icon-sets.iconify.design/tabler/ban/ */
export const BanIcon = createOutlineIcon('ban', [
  'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m2.7-6.3l12.6 12.6',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: leaf — https://icon-sets.iconify.design/tabler/leaf/ */
export const LeafIcon = createOutlineIcon('leaf', [
  'M5 21c.5-4.5 2.5-8 7-10',
  'M9 18c6.218 0 10.5-3.288 11-12V4h-4.014c-9 0-11.986 4-12 9c0 1 0 3 2 5z',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: gender-female — https://icon-sets.iconify.design/tabler/gender-female/ */
export const GenderFemaleIcon = createOutlineIcon('gender-female', [
  'M7 9a5 5 0 1 0 10 0A5 5 0 1 0 7 9m5 5v7m-3-3h6',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: gender-male — https://icon-sets.iconify.design/tabler/gender-male/ */
export const GenderMaleIcon = createOutlineIcon('gender-male', [
  'M5 14a5 5 0 1 0 10 0a5 5 0 1 0-10 0m14-9l-5.4 5.4M19 5h-5m5 0v5',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: wind — https://icon-sets.iconify.design/tabler/wind/ */
export const WindIcon = createOutlineIcon('wind', [
  'M5 8h8.5a2.5 2.5 0 1 0-2.34-3.24M3 12h15.5a2.5 2.5 0 1 1-2.34 3.24M4 16h5.5a2.5 2.5 0 1 1-2.34 3.24',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: droplet-half-2 — https://icon-sets.iconify.design/tabler/droplet-half-2/ */
export const DropletHalfIcon = createOutlineIcon('droplet-half-2', [
  'M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0s3.262-5.708 1.566-8.546l-4.89-7.26c-.42-.625-1.287-.803-1.936-.397a1.4 1.4 0 0 0-.41.397l-4.893 7.26C4.24 13.715 4.9 17.318 7.502 19.423M5 14h14',
], { className: 'w-6 h-6', strokeWidth: 2 })

/** Tabler: atom-2 — https://icon-sets.iconify.design/tabler/atom-2/ */
export const AtomIcon = createOutlineIcon('atom-2', [
  'M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m3 9v.01M3 9v.01M21 9v.01M8 20.1A9 9 0 0 1 3 13m13 7.1a9 9 0 0 0 5-7.1M6.2 5a9 9 0 0 1 11.4 0',
], { className: 'w-6 h-6', strokeWidth: 2 })
