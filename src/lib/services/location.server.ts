import type { City } from '@/lib/services/location'

function mainApiBaseUrl(): string {
  const raw =
    process.env.MAIN_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_MAIN_API_URL?.trim() ||
    'http://localhost:8000'
  return raw.replace(/\/$/, '')
}

/**
 * Server-only: load CommonCity list once per request (cached via `revalidate`).
 */
export async function fetchCommonCitiesServer(): Promise<{
  cities: City[]
  error: string | null
}> {
  const url = `${mainApiBaseUrl()}/common-cities/`
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      return { cities: [], error: `Không tải được danh sách tỉnh/thành (HTTP ${res.status})` }
    }
    const data: unknown = await res.json()
    if (!Array.isArray(data)) {
      return { cities: [], error: 'Phản hồi common-cities không hợp lệ' }
    }
    const cities = data as City[]
    return { cities, error: null }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'fetch common-cities failed'
    return { cities: [], error: msg }
  }
}
