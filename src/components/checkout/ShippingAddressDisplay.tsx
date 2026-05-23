import { formatShippingAddressLines } from '@/lib/utils/shippingAddressDisplay'

type Props = {
  shippingAddress: string | null | undefined
  className?: string
}

/** Two-line shipping block for order confirmation / order detail (parses BE multiline text). */
export function ShippingAddressDisplay({ shippingAddress, className = '' }: Props) {
  const lines = formatShippingAddressLines(shippingAddress)
  if (!lines) return null

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</h3>
      <div className="space-y-1 text-sm text-gray-600">
        <p>{lines.line1}</p>
        <p>{lines.line2}</p>
      </div>
    </div>
  )
}
