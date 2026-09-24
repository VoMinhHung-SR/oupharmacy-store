'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'
import { Button } from '@/components/Button'
import { CabinetAlertsPanel } from '@/components/cabinet/CabinetAlertsPanel'
import { STORE_SUPPORT } from '@/lib/constant'
import { useCabinet } from '@/lib/hooks/useCabinet'

export function MedicationReminderWorkspace() {
  const router = useRouter()
  const cabinet = useCabinet(true)
  const cabinets = cabinet.cabinets
  const hasCabinets = cabinets.length > 0
  const reminderOnCount = cabinets.filter((row) => row.reminder_enabled).length

  return (
    <div className="space-y-5">
      <AccountPageHeader
        title="Nhắc uống thuốc"
        subtitle="Hộp thư nhắc hạn dùng từ tủ thuốc. Bật/tắt nhắc và quản lý thuốc trong tủ thuốc."
      />

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">Trạng thái nhắc</h2>
            <p className="mt-1 text-sm text-gray-500">
              {cabinet.isLoading
                ? 'Đang tải tủ thuốc…'
                : hasCabinets
                  ? `${reminderOnCount}/${cabinets.length} tủ đang bật nhắc hạn.`
                  : 'Bạn chưa có tủ thuốc. Tạo tủ để nhận nhắc hạn dùng.'}
            </p>
          </div>
          <Button
            size="sm"
            variant={hasCabinets ? 'outline' : 'primary'}
            onClick={() => router.push(STORE_SUPPORT.CABINET_HREF)}
          >
            {hasCabinets ? 'Mở tủ thuốc' : 'Tạo tủ thuốc'}
          </Button>
        </div>

        {hasCabinets ? (
          <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
            {cabinets.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{row.name}</p>
                  <p className="text-xs text-gray-500">
                    Sắp hết hạn trong {row.expiring_soon_days} ngày
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    row.reminder_enabled
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {row.reminder_enabled ? 'Đang bật nhắc' : 'Đã tắt nhắc'}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <CabinetAlertsPanel enabled />

      <p className="text-xs text-gray-500">
        Nhắc hạn dùng được tạo khi quét tủ (không gửi push). Chi tiết thuốc và cài đặt nhắc nằm trong{' '}
        <Link href={STORE_SUPPORT.CABINET_HREF} className="font-medium text-primary-700 underline">
          tủ thuốc
        </Link>
        .
      </p>
    </div>
  )
}
