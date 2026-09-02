/** Clinic public site (Vite) — booking flow at `/booking`. */
export function getClinicSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_CLINIC_SITE_URL?.trim()
  return (raw || 'http://localhost:5173').replace(/\/$/, '')
}

export function getClinicBookingUrl(): string {
  return `${getClinicSiteOrigin()}/booking`
}
