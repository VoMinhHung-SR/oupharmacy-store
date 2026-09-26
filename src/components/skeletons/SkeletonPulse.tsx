interface SkeletonPulseProps {
  className?: string
}

/** Shared pulse block for page/route skeletons. */
export function SkeletonPulse({ className = '' }: SkeletonPulseProps) {
  const hasBg = /\bbg-/.test(className)
  return (
    <div
      className={`animate-pulse rounded ${hasBg ? '' : 'bg-gray-200'} ${className}`.trim()}
      aria-hidden
    />
  )
}
