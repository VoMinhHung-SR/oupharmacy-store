/** QR image for PWA / store origin (same API as cart install banner). */
export function buildAppInstallQrUrl(origin: string, size = 160): string {
  const data = encodeURIComponent(origin)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=6&data=${data}`
}
