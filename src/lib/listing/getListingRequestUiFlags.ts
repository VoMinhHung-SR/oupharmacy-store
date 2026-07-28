/**
 * Shared listing request → UI flags (search page + category browse).
 * Keeps prior grid visible under a refresh backdrop instead of flashing empty.
 */
export function getListingRequestUiFlags(input: {
  page: number
  productCount: number
  hasData: boolean
  isLoading: boolean
  isFetching: boolean
  isPlaceholderData: boolean
  /** When false, never treat as initial/refresh (e.g. non-category store page). */
  enabled?: boolean
}): {
  isInitialLoad: boolean
  isRefreshing: boolean
  isFetchingMore: boolean
} {
  const enabled = input.enabled !== false
  const isSettledEmpty =
    input.hasData &&
    !input.isPlaceholderData &&
    !input.isFetching &&
    input.productCount === 0

  const isInitialLoad =
    enabled &&
    input.productCount === 0 &&
    !isSettledEmpty &&
    (input.isLoading || input.isFetching || input.isPlaceholderData)

  return {
    isInitialLoad,
    isRefreshing:
      enabled &&
      input.page <= 1 &&
      !isInitialLoad &&
      (input.isFetching || input.isPlaceholderData),
    isFetchingMore: enabled && input.page > 1 && input.isFetching,
  }
}
