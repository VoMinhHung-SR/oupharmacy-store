export interface ApiResponse<T> {
  data: T
  error?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://example.com/api'

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as T
    return { data }
  } catch (e: any) {
    return { data: undefined as unknown as T, error: e.message }
  }
}


