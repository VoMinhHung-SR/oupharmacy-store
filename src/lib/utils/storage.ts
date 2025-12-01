/**
 * Utility functions để encode/decode sensitive data trong localStorage
 */

/**
 * Encode data thành base64 string
 */
export function encodeData<T>(data: T): string {
  try {
    const jsonString = JSON.stringify(data)
    return btoa(encodeURIComponent(jsonString))
  } catch (error) {
    console.error('Error encoding data:', error)
    return ''
  }
}

/**
 * Decode base64 string về data
 */
export function decodeData<T>(encoded: string): T | null {
  try {
    const jsonString = decodeURIComponent(atob(encoded))
    return JSON.parse(jsonString) as T
  } catch (error) {
    console.error('Error decoding data:', error)
    return null
  }
}

/**
 * Lưu encoded data vào localStorage
 */
export function setEncodedItem(key: string, data: any): void {
  if (typeof window === 'undefined') return
  try {
    const encoded = encodeData(data)
    localStorage.setItem(key, encoded)
  } catch (error) {
    console.error('Error setting encoded item:', error)
  }
}

/**
 * Lấy và decode data từ localStorage
 */
export function getEncodedItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const encoded = localStorage.getItem(key)
    if (!encoded) return null
    return decodeData<T>(encoded)
  } catch (error) {
    console.error('Error getting encoded item:', error)
    return null
  }
}

/**
 * Xóa encoded item từ localStorage
 */
export function removeEncodedItem(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}


