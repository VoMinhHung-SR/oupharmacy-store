interface SkeletonPulseProps {
  className?: string
}

/** Shared pulse block for page/route skeletons. */
export function SkeletonPulse({ className = '' }: SkeletonPulseProps) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`.trim()} aria-hidden />
}
