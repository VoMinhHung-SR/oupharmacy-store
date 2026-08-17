import type { PublicCampaignVoucher } from '@/lib/services/campaign'

export interface CampaignVoucherStripProps {
  vouchers: PublicCampaignVoucher[]
  heading: string
}

export function CampaignVoucherStrip({ vouchers, heading }: CampaignVoucherStripProps) {
  const visible = vouchers.filter((row) => row.is_displayable !== false && row.code)
  if (!visible.length) return null

  return (
    <section aria-label={heading} className="rounded-2xl border border-secondary-100 bg-secondary-50/80 px-4 py-3 sm:px-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary-800">{heading}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {visible.map((voucher) => (
          <li
            key={voucher.code}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-secondary-200 bg-white px-3 py-1.5 text-sm"
          >
            <span className="font-mono font-bold tracking-wide text-primary-700">{voucher.code}</span>
            {voucher.description ? (
              <span className="truncate text-gray-600">{voucher.description}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
