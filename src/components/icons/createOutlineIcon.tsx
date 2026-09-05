import type { SvgIconProps } from './types'

type OutlineDefaults = {
  className?: string
  strokeWidth?: number
}

/** Factory for self-hosted Tabler outline icons (MIT). */
export function createOutlineIcon(
  tablerId: string,
  paths: readonly string[],
  defaults: OutlineDefaults = {},
) {
  const defaultClassName = defaults.className ?? 'w-6 h-6'
  const defaultStrokeWidth = defaults.strokeWidth ?? 2

  function OutlineIcon({
    className = defaultClassName,
    size,
    strokeWidth = defaultStrokeWidth,
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
        data-icon={`tabler:${tablerId}`}
        {...rest}
      >
        {paths.map((d) => (
          <path
            key={d}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            d={d}
          />
        ))}
      </svg>
    )
  }

  OutlineIcon.displayName = `${tablerId}Icon`

  return OutlineIcon
}
