import { apiGet, apiPost, ApiResponse } from '../api'

export interface SearchKeywordItem {
  id: number
  keyword: string
  hit_count: number
  last_searched_at: string
}

/**
 * Lấy danh sách từ khóa tìm kiếm phổ biến (để hiển thị "Tìm kiếm phổ biến" trên header / trang tìm kiếm).
 */
export async function getPopularSearchTerms(limit = 20): Promise<ApiResponse<SearchKeywordItem[]>> {
  return apiGet<SearchKeywordItem[]>(`/search-terms/?limit=${limit}`)
}

/**
 * Ghi nhận một lần tìm kiếm (tăng hit_count cho từ khóa) — gọi khi user submit form tìm kiếm.
 */
export async function recordSearch(keyword: string): Promise<ApiResponse<SearchKeywordItem>> {
  const trimmed = (keyword || '').trim()
  if (!trimmed) return { data: undefined as unknown as SearchKeywordItem }
  return apiPost<SearchKeywordItem>('/search-terms/', { keyword: trimmed })
}
