/**
 * Heuristic while resolve-path is pending (matches BE: multi-segment paths try product first).
 */
export function shouldShowProductDetailSkeletonWhileResolving(storePath: string): boolean {
  return storePath.split('/').filter(Boolean).length >= 2
}
