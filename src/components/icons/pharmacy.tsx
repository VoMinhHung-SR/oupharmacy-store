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
