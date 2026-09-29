/** Clinic public site (Vite) — booking flow at `/booking`. */
export function getClinicSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_CLINIC_SITE_URL?.trim()
  return (raw || 'http://localhost:5173').replace(/\/$/, '')
}

export function getClinicBookingUrl(): string {
  return `${getClinicSiteOrigin()}/booking`
}

/**
 * Public storefront origin for metadataBase / sitemap / absolute OG URLs.
 * Prefer NEXT_PUBLIC_SITE_URL; fall back to Vercel URL or localhost.
 */
export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, '')
    return `https://${host}`
  }
  return 'http://localhost:3000'
}
