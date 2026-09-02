type ProductCardMerchRailCtaProps = {
  shockOffer?: 'off' | 'compact'
}

export function ProductCardMerchRailCta({ shockOffer = 'off' }: ProductCardMerchRailCtaProps) {
  return (
    <div className="flex flex-col">
      {shockOffer === 'compact' ? (
        <span className="relative mb-1.5 inline-flex min-h-[1rem] w-full items-center justify-center rounded-full bg-[#f4a9a2] px-2 py-0.5">
          <span
            className="absolute left-1.5 inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[8px] leading-none text-white"
            aria-hidden
          >
            🔥
          </span>
          <span className="px-3.5 text-center text-[10px] font-semibold leading-tight text-white sm:text-[11px]">
            Ưu đãi cực sốc
          </span>
        </span>
      ) : null}

      <span
        className={`block w-full text-center text-sm font-semibold leading-tight text-primary-700 transition-colors ${
          shockOffer === 'compact'
            ? 'rounded-full bg-[#eef3fb] px-3 py-2 text-primary-800 group-hover:bg-[#e4ecfa]'
            : 'rounded-xl border border-primary-200 bg-primary-50 py-2 group-hover:border-primary-300 group-hover:bg-primary-100'
        }`}
      >
        Xem chi tiết
      </span>
    </div>
  )
}
