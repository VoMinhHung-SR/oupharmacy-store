export type ShippingAddressDisplay = {
  recipientName: string
  recipientPhone: string
  address: string
  ward: string
  city: string
  /** True when structured BE lines were parsed. */
  parsed: boolean
}

const RECIPIENT_RE = /^Người nhận:\s*(.+)$/i
const REGION_RE = /^Địa chỉ hành chính sau sáp nhập:\s*(.+)$/i
const DETAIL_RE = /^Địa chỉ cụ thể:\s*(.+)$/i

function splitNamePhone(rest: string): { name: string; phone: string } {
  const normalized = rest.trim()
  const parts = normalized.split(/\s*[—–-]{1,3}\s*/)
  if (parts.length >= 2) {
    const phone = parts[parts.length - 1].trim()
    const name = parts.slice(0, -1).join(' — ').trim()
    return { name, phone }
  }
  return { name: normalized, phone: '' }
}

/**
 * @param raw - `Order.shipping_address` from API
 */
export function parseShippingAddressForDisplay(raw: string | null | undefined): ShippingAddressDisplay | null {
  if (!raw || !String(raw).trim()) return null

  const text = String(raw).trim()
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

  let recipientName = ''
  let recipientPhone = ''
  let address = ''
  let ward = ''
  let city = ''

  for (const line of lines) {
    const recipientMatch = line.match(RECIPIENT_RE)
    if (recipientMatch) {
      const { name, phone } = splitNamePhone(recipientMatch[1])
      recipientName = name
      recipientPhone = phone
      continue
    }

    const regionMatch = line.match(REGION_RE)
    if (regionMatch) {
      const parts = regionMatch[1]
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
      if (parts.length >= 1) city = parts[0]
      if (parts.length === 2) ward = parts[1]
      if (parts.length >= 3) {
        city = parts[0]
        ward = parts[parts.length - 1]
      }
      continue
    }

    const detailMatch = line.match(DETAIL_RE)
    if (detailMatch) {
      address = detailMatch[1].trim()
    }
  }

  const parsed = Boolean(recipientName && (address || city || ward))

  if (!parsed) {
    return {
      recipientName: '',
      recipientPhone: '',
      address: text,
      ward: '',
      city: '',
      parsed: false,
    }
  }

  return {
    recipientName,
    recipientPhone,
    address,
    ward,
    city,
    parsed: true,
  }
}

export function formatShippingAddressLines(raw: string | null | undefined): {
  line1: string
  line2: string
} | null {
  const parsed = parseShippingAddressForDisplay(raw)
  if (!parsed) return null

  if (!parsed.parsed) {
    return {
      line1: 'Địa chỉ giao hàng',
      line2: parsed.address,
    }
  }

  const line1 = `Người nhận: ${parsed.recipientName} --- ${parsed.recipientPhone}`
  const addressParts = [parsed.address, parsed.ward, parsed.city].filter(Boolean)
  const line2 = `Địa chỉ: ${addressParts.join(', ')}`

  return { line1, line2 }
}
