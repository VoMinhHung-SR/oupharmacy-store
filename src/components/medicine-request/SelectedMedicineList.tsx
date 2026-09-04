'use client'

import type { SelectedMedicine } from '@/components/medicine-request/types'

type SelectedMedicineListProps = {
  items: SelectedMedicine[]
  onRemove: (productId: number) => void
}

export function SelectedMedicineList({ items, onRemove }: SelectedMedicineListProps) {
  if (items.length === 0) return null

  return (
    <ul className="divide-y divide-slate-100 rounded-b-lg border border-t-0 border-slate-200 bg-white shadow-sm">
      {items.map((item) => (
        <li key={item.productId} className="flex items-center gap-3 px-4 py-3 sm:px-5">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.imageUrl} alt="" className="h-12 w-12 rounded-md object-cover" />
          ) : (
            <span className="h-12 w-12 rounded-md bg-slate-100" aria-hidden />
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-slate-900">{item.productName}</span>
            {item.packing ? (
              <span className="block truncate text-xs text-gray-500">{item.packing}</span>
            ) : null}
          </span>
          <button
            type="button"
            className="text-sm font-medium text-primary-700 hover:underline"
            onClick={() => onRemove(item.productId)}
          >
            Xóa
          </button>
        </li>
      ))}
    </ul>
  )
}
