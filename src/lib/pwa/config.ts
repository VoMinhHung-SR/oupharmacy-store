/**
 * PWA is opt-in via env so local `npm run dev` / `next start` never register a SW
 * that can cache stale webpack chunks.
 *
 * Set in container / staging / production:
 *   NEXT_PUBLIC_ENABLE_PWA=true
 */
export function isPwaEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_PWA === 'true'
}
