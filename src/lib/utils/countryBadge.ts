/** Resolved country badge: display label + optional ISO 3166-1 alpha-2 for flag rendering. */
export type CountryBadgeResolved = {
  label: string
  isoCode: string | null
}

export const CANONICAL_COUNTRY_LABEL_TO_ISO: Record<string, string> = {
  'việt nam': 'VN',
  'ấn độ': 'IN',
  'hàn quốc': 'KR',
  'mỹ': 'US',
  'nhật bản': 'JP',
  pháp: 'FR',
  'ý': 'IT',
  'đức': 'DE',
  'tây ban nha': 'ES',
  'úc': 'AU',
  anh: 'GB',
  'thái lan': 'TH',
  pakistan: 'PK',
  'trung quốc': 'CN',
  hungary: 'HU',
  'hoa kỳ': 'US',
}

const COUNTRY_ALIASES: Record<string, string> = {
  vietnam: 'VN',
  india: 'IN',
  korea: 'KR',
  'south korea': 'KR',
  usa: 'US',
  'united states': 'US',
  japan: 'JP',
  france: 'FR',
  italy: 'IT',
  germany: 'DE',
  spain: 'ES',
  australia: 'AU',
  uk: 'GB',
  'united kingdom': 'GB',
  thailand: 'TH',
  china: 'CN',
}

function countryKeyWithDiacritics(value: string): string {
  return value.trim().toLowerCase()
}

function countryKeyAscii(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const COUNTRY_ISO_LOOKUP: Record<string, string> = (() => {
  const lookup: Record<string, string> = {}
  const all = { ...CANONICAL_COUNTRY_LABEL_TO_ISO, ...COUNTRY_ALIASES }
  for (const [label, iso] of Object.entries(all)) {
    lookup[countryKeyWithDiacritics(label)] = iso
    lookup[countryKeyAscii(label)] = iso
  }
  return lookup
})()

function resolveIsoFromLabel(label: string): string | null {
  const withMarks = countryKeyWithDiacritics(label)
  const ascii = countryKeyAscii(label)

  // Label map first — "Mỹ" folds to "my" and must not become ISO MY (Malaysia).
  const fromLookup = COUNTRY_ISO_LOOKUP[withMarks] ?? COUNTRY_ISO_LOOKUP[ascii]
  if (fromLookup) return fromLookup

  if (/^[a-z]{2}$/i.test(ascii)) {
    return ascii.toUpperCase()
  }

  return null
}

/** Map BE `brand.country` text (or raw ISO) to label + isoCode for CardBadge. */
export function resolveCountryBadge(
  country: string | null | undefined
): CountryBadgeResolved | null {
  const label = country?.trim()
  if (!label) return null

  return { label, isoCode: resolveIsoFromLabel(label) }
}

/** Static SVG under `public/flags/{iso}.svg` (lowercase ISO). */
export function countryFlagSrc(isoCode: string): string {
  return `/flags/${isoCode.trim().toLowerCase()}.svg`
}

/** ISO codes that have a file in `public/flags/`. */
export const FLAG_ASSET_ISO_CODES = new Set([
  'VN', 'IN', 'KR', 'US', 'JP', 'FR', 'IT', 'DE', 'ES', 'AU', 'GB', 'TH', 'PK', 'CN', 'HU',
])
