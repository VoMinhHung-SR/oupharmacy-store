import { createOutlineIcon } from './createOutlineIcon'
import type { SvgIconProps } from './types'

export const PillIcon = createOutlineIcon(
  'pill',
  ['m4.5 12.5l8-8a4.94 4.94 0 0 1 7 7l-8 8a4.94 4.94 0 0 1-7-7m4-4l7 7'],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

/**
 * Pill with plus badge — “Cần mua thuốc” quick link.
 */
export function PillPlusIcon({
  className = 'h-6 w-6',
  size,
  strokeWidth = 2,
  ...rest
}: SvgIconProps) {
  return (
    <svg
      className={`block shrink-0 ${className}`.trim()}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-icon="pill-plus"
      {...rest}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="m4.5 12.5l8-8a4.94 4.94 0 0 1 7 7l-8 8a4.94 4.94 0 0 1-7-7m4-4l7 7"
      />
      <circle cx="6" cy="6" r="4.25" fill="currentColor" stroke="none" />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M6 4v4M4 6h4"
      />
    </svg>
  )
}

export const CapsuleIcon = createOutlineIcon(
  'capsule',
  ['M6 9a6 6 0 0 1 6-6a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6a6 6 0 0 1-6-6z'],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const MilkIcon = createOutlineIcon(
  'milk',
  [
    'M8 6h8V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1zm8 0l1.094 1.759a6 6 0 0 1 .906 3.17V19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8.071a6 6 0 0 1 .906-3.17L8 6',
    'M10 16a2 2 0 1 0 4 0a2 2 0 1 0-4 0m0-6h4',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const MedicineSyrupIcon = createOutlineIcon(
  'medicine-syrup',
  [
    'M8 21h8a1 1 0 0 0 1-1V10a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v10a1 1 0 0 0 1 1m2-7h4m-2-2v4m-2-9V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const VaccineIcon = createOutlineIcon(
  'vaccine',
  ['m17 3l4 4m-2-2l-4.5 4.5m-3-3l6 6m-1-1L10 18H6v-4l6.5-6.5m-5 5L9 14m1.5-4.5L12 11M3 21l3-3'],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const NeedleIcon = createOutlineIcon(
  'needle',
  ['M3 21Q2 20 14.785 4.291a3.5 3.5 0 1 1 5.078 4.791Q4.001 22 3 21M17.5 6.5l-1 1'],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const FirstAidKitIcon = createOutlineIcon(
  'first-aid-kit',
  [
    'M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm6 4h4m-2-2v4',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const BottleIcon = createOutlineIcon(
  'bottle',
  [
    'M10 5h4V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1z',
    'M14 3.5c0 1.626.507 3.212 1.45 4.537l.05.07a8.1 8.1 0 0 1 1.5 4.694V19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6.2c0-1.682.524-3.322 1.5-4.693l.05-.07A7.82 7.82 0 0 0 10 3.5',
    'M7 14.803A2.4 2.4 0 0 0 8 14a2.4 2.4 0 0 1 2-1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 1 1-.805',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const BandageIcon = createOutlineIcon(
  'bandage',
  ['M14 12v.01M10 12v.01M12 10v.01M12 14v.01M4.5 12.5l8-8a4.94 4.94 0 0 1 7 7l-8 8a4.94 4.94 0 0 1-7-7'],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const PerfumeIcon = createOutlineIcon(
  'perfume',
  [
    'M10 6v3m4-3v3m-9 2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z',
    'M10 15a2 2 0 1 0 4 0a2 2 0 1 0-4 0M9 3h6v3H9z',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const SprayIcon = createOutlineIcon(
  'spray',
  [
    'M4 12a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-2V6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4m5-3h.01M18 9h.01M18 5h.01M21 3h.01M21 7h.01M21 11h.01M10 7h1',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

/** Tabler: face-mask — https://icon-sets.iconify.design/tabler/face-mask/ */
export const FaceMaskIcon = createOutlineIcon(
  'face-mask',
  [
    'M5 14.5h-.222C3.243 14.5 2 13.38 2 12s1.243-2.5 2.778-2.5H5m14 5h.222C20.756 14.5 22 13.38 22 12s-1.244-2.5-2.778-2.5H19M9 10h6m-6 4h6',
    'm12.55 18.843l5-1.429A2 2 0 0 0 19 15.491V8.51a2 2 0 0 0-1.45-1.923l-5-1.429a2 2 0 0 0-1.1 0l-5 1.429A2 2 0 0 0 5 8.509v6.982a2 2 0 0 0 1.45 1.923l5 1.429a2 2 0 0 0 1.1 0',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

/** Tabler: hand-sanitizer — https://icon-sets.iconify.design/tabler/hand-sanitizer/ */
export const HandSanitizerIcon = createOutlineIcon(
  'hand-sanitizer',
  ['M7 21h10V11a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3zm8-18H9a2 2 0 0 0-2 2m5-2v5m0 3v4m-2-2h4'],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

/** Tabler: dental — https://icon-sets.iconify.design/tabler/dental/ */
export const DentalIcon = createOutlineIcon(
  'dental',
  [
    'M12 5.5C10.926 4.914 9.417 4 8 4C5.9 4 4 5.247 4 9c0 4.899 1.056 8.41 2.671 10.537c.573.756 1.97.521 2.567-.236q.597-.758 1.262-2.801c.292-.771.892-1.504 1.5-1.5c.602 0 1.21.737 1.5 1.5q.665 2.043 1.262 2.8c.597.759 2 .993 2.567.237C18.944 17.41 20 13.9 20 9c0-3.74-1.908-5-4-5c-1.423 0-2.92.911-4 1.5m0 0L15 7',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

/** Tabler: razor-electric — https://icon-sets.iconify.design/tabler/razor-electric/ */
export const RazorElectricIcon = createOutlineIcon(
  'razor-electric',
  ['M8 3v2m4-2v2m4-2v2m-7 7v6a3 3 0 0 0 6 0v-6zM8 5h8l-1 4H9zm4 12v1'],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

/** Tabler: pills — https://icon-sets.iconify.design/tabler/pills/ */
export const PillsIcon = createOutlineIcon(
  'pills',
  ['M3 8a5 5 0 1 0 10 0A5 5 0 1 0 3 8m10 9a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4.5 4.5l7 7m8 3l-5 5'],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

/** Tabler: tools — https://icon-sets.iconify.design/tabler/tools/ */
export const ToolsIcon = createOutlineIcon(
  'tools',
  [
    'M3 21h4L20 8a1.5 1.5 0 0 0-4-4L3 17zM14.5 5.5l4 4',
    'M12 8L7 3L3 7l5 5M7 8L5.5 9.5M16 12l5 5l-4 4l-5-5m4 1l-1.5 1.5',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

/** Tabler: wash-hand — https://icon-sets.iconify.design/tabler/wash-hand/ */
export const WashHandIcon = createOutlineIcon(
  'wash-hand',
  [
    'M3.486 8.965Q3.738 8.996 4 9c.79.009 1.539-.178 2-.5c.426-.296.777-.5 1.5-.5h1M16 8l.615.034c.552.067 1.046.23 1.385.466c.461.322 1.21.509 2 .5q.256-.002.503-.034M14 10.5l.586.578a1.516 1.516 0 0 0 2 0c.476-.433.55-1.112.176-1.622L15 7c-.37-.506-1.331-1-2-1H9.883a1 1 0 0 0-.992.876l-.499 3.986A3.86 3.86 0 0 0 11 15a2.28 2.28 0 0 0 3-2.162z',
    'm3 6l1.721 10.329A2 2 0 0 0 6.694 18h10.612a2 2 0 0 0 1.973-1.671L21 6',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

/** Tabler: shirt — https://icon-sets.iconify.design/tabler/shirt/ */
export const ShirtIcon = createOutlineIcon(
  'shirt',
  ['m15 4l6 2v5h-3v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8H3V6l6-2a3 3 0 0 0 6 0'],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

/** Medicine jar — “Tủ thuốc thông minh”. */
export const JarOfPillsIcon = createOutlineIcon(
  'jar-of-pills',
  [
    'M6 3.5C6 3.03406 6 2.80109 6.07612 2.61732C6.17761 2.37229 6.37229 2.17761 6.61732 2.07612C6.80109 2 7.03406 2 7.5 2H16.5C16.9659 2 17.1989 2 17.3827 2.07612C17.6277 2.17761 17.8224 2.37229 17.9239 2.61732C18 2.80109 18 3.03406 18 3.5C18 3.96594 18 4.19891 17.9239 4.38268C17.8224 4.62771 17.6277 4.82239 17.3827 4.92388C17.1989 5 16.9659 5 16.5 5H7.5C7.03406 5 6.80109 5 6.61732 4.92388C6.37229 4.82239 6.17761 4.62771 6.07612 4.38268C6 4.19891 6 3.96594 6 3.5Z',
    'M4.5 18H19.5',
    'M4.5 10H19.5',
    'M5.50122 7.79902L7.90434 5.87652C8.44688 5.4425 8.71814 5.22549 9.03955 5.11274C9.36095 5 9.70834 5 10.4031 5H13.6427C14.3438 5 14.6943 5 15.0182 5.11466C15.3421 5.22933 15.6146 5.44989 16.1595 5.89102L18.5168 7.79931C19.455 8.55877 20 9.70126 20 10.9083V17.5649C20 18.4927 19.6775 19.3916 19.0877 20.1078L18.7294 20.5428C17.9696 21.4655 16.837 22 15.6417 22H8.95693C8.38582 22 8.10026 22 7.82957 21.9628C7.02661 21.8526 6.27608 21.5011 5.67738 20.9548C5.47554 20.7706 5.29272 20.5513 4.92711 20.1125C4.32806 19.3937 4 18.4875 4 17.5518V10.9225C4 9.70736 4.55236 8.55811 5.50122 7.79902Z',
    'M12 12V16M10 14L14 14',
  ],
  { className: 'w-6 h-6', strokeWidth: 1.5 },
)
