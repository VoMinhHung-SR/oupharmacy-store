import type { SelectedMedicine } from '@/components/medicine-request/types'
import type { User } from '@/lib/services/auth'

export function medicineRequestDisplayName(
  user: Pick<User, 'first_name' | 'last_name' | 'name'> | null
) {
  if (!user) return ''
  const combined = [user.first_name, user.last_name].filter(Boolean).join(' ').trim()
  return combined || user.name || ''
}

export function buildMedicineRequestMessage(note: string | undefined, items: SelectedMedicine[]) {
  const lines: string[] = []
  const trimmed = (note || '').trim()
  if (trimmed) {
    lines.push('Ghi chú:', trimmed, '')
  }
  if (items.length > 0) {
    lines.push('Sản phẩm:')
    for (const item of items) {
      lines.push(`- ${item.productId} | ${item.productName} | sl ${item.quantity}`)
    }
  } else {
    lines.push('Sản phẩm: (chưa chọn)')
  }
  return lines.join('\n')
}
