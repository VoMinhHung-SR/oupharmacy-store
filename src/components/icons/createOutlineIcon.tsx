import type { SvgIconProps } from './types'

type OutlineDefaults = {
  className?: string
  strokeWidth?: number
  /** Override `data-icon` (defaults to icon id). */
  dataIcon?: string
}

function mergeIconClass(base: string, override?: string) {
  // Always kill SVG baseline gap (inline svg otherwise leaves space under the glyph).
  return ['block', 'shrink-0', override || base].filter(Boolean).join(' ')
}

/** Factory for self-hosted outline icons. */
export function createOutlineIcon(
  iconId: string,
  paths: readonly string[],
  defaults: OutlineDefaults = {},
) {
  const defaultClassName = defaults.className ?? 'h-6 w-6'
  const defaultStrokeWidth = defaults.strokeWidth ?? 2
  const dataIcon = defaults.dataIcon || iconId

  function OutlineIcon({
    className,
    size,
    strokeWidth = defaultStrokeWidth,
    ...rest
  }: SvgIconProps) {
    return (
      <svg
        className={mergeIconClass(defaultClassName, className)}
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
        data-icon={dataIcon}
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

  OutlineIcon.displayName = `${iconId}Icon`

  return OutlineIcon
}
