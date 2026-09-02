'use client'

import React, { type Ref, useMemo, useState } from 'react'
import { CheckCircleIcon, ChevronRightIcon, EmptyOfferIllustration, PromoIcon } from '@/components/icons'
import type { CartVoucherOffer } from '@/lib/services/carts'
import { buildVoucherOfferTitle, formatVoucherExpiryLabel } from '@/lib/utils/voucherOfferCopy'

export interface CartVoucherOfferSheetBodyProps {
  manualCode: string
  onManualCodeChange: (value: string) => void
  inputRef?: Ref<HTMLInputElement>
  isApplying: boolean
  offers: CartVoucherOffer[]
  unavailableOffers?: CartVoucherOffer[]
  selectedCode: string | null
  onSelectOffer: (code: string) => void
  onSubmitManual: () => void | Promise<void>
  isLoadingOffers?: boolean
  offersError?: string | null
  emptyHint?: string
}

function partitionPrimaryOffers(offers: CartVoucherOffer[]) {
  const applied = offers.filter((offer) => offer.is_applied)
  const eligibleRemaining = offers.filter((offer) => offer.is_eligible && !offer.is_applied)
  return { applied, eligibleRemaining }
}

function OfferCard({
  offer,
  selected,
  disabled,
  onSelect,
}: {
  offer: CartVoucherOffer
  selected: boolean
  disabled?: boolean
  onSelect: () => void
}) {
  const title = buildVoucherOfferTitle(offer)
  const expiry = formatVoucherExpiryLabel(offer.end_at)
  const subtitle = offer.is_applied
    ? 'Đang áp dụng'
    : !offer.is_eligible
      ? offer.ineligible_reason ?? 'Chưa đủ điều kiện áp dụng'
      : expiry

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-3.5 text-left transition-colors ${
        offer.is_applied
          ? 'border-primary-400 bg-primary-50'
          : selected
            ? 'border-primary-300 bg-primary-50/70'
            : disabled
              ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-80'
              : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50'
      }`}
    >
      <PromoIcon
        size="lg"
        tone={offer.is_applied || selected ? 'soft' : 'muted'}
        className="mt-0.5"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium leading-snug text-slate-900">{title}</span>
        {subtitle ? (
          <span
            className={`mt-1 block text-xs ${
              offer.is_applied ? 'font-medium text-primary-700' : 'text-slate-500'
            }`}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
      {offer.is_applied || selected ? (
        <CheckCircleIcon className="mt-1 h-6 w-6 shrink-0 text-primary-600" aria-hidden />
      ) : (
        <span className="mt-1 h-6 w-6 shrink-0 rounded-full border-2 border-slate-200" aria-hidden />
      )}
    </button>
  )
}

function OfferSection({
  title,
  offers,
  selectedCode,
  onSelectOffer,
}: {
  title: string
  offers: CartVoucherOffer[]
  selectedCode: string | null
  onSelectOffer: (code: string) => void
}) {
  if (offers.length === 0) return null
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="space-y-3">
        {offers.map((offer) => (
          <OfferCard
            key={offer.code}
            offer={offer}
            selected={selectedCode === offer.code}
            disabled={!offer.is_eligible}
            onSelect={() => {
              if (offer.is_eligible) onSelectOffer(offer.code)
            }}
          />
        ))}
      </div>
    </section>
  )
}

export function CartVoucherOfferSheetBody({
  manualCode,
  onManualCodeChange,
  inputRef,
  isApplying,
  offers,
  unavailableOffers = [],
  selectedCode,
  onSelectOffer,
  onSubmitManual,
  isLoadingOffers = false,
  offersError = null,
  emptyHint = 'Nhập mã giảm giá hoặc chọn ưu đãi bên dưới',
}: CartVoucherOfferSheetBodyProps) {
  const [showUnavailable, setShowUnavailable] = useState(false)
  const { applied, eligibleRemaining } = useMemo(() => partitionPrimaryOffers(offers), [offers])
  const hasPrimary = offers.length > 0
  const hasUnavailable = unavailableOffers.length > 0
  const hasAny = hasPrimary || hasUnavailable

  return (
    <div className="space-y-4 px-5 py-4">
      <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
        <input
          ref={inputRef}
          type="text"
          value={manualCode}
          onChange={(e) => onManualCodeChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void onSubmitManual()
          }}
          placeholder="Nhập mã giảm giá"
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          disabled={isApplying || !manualCode.trim()}
          onClick={() => void onSubmitManual()}
          className="shrink-0 border-l border-slate-200 bg-primary-50 px-4 text-sm font-semibold text-primary-800 transition-colors hover:bg-primary-100 disabled:opacity-50"
        >
          Xác nhận
        </button>
      </div>

      {isLoadingOffers ? (
        <div className="space-y-3" aria-busy="true">
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
        </div>
      ) : offersError ? (
        <div className="rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-800">{offersError}</div>
      ) : hasAny ? (
        <div className="space-y-4">
          <OfferSection
            title="Đang áp dụng"
            offers={applied}
            selectedCode={selectedCode}
            onSelectOffer={onSelectOffer}
          />
          <OfferSection
            title={applied.length > 0 ? 'Có thể áp dụng' : 'Ưu đãi dành cho bạn'}
            offers={eligibleRemaining}
            selectedCode={selectedCode}
            onSelectOffer={onSelectOffer}
          />

          {hasUnavailable ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowUnavailable((open) => !open)}
                className="flex w-full items-center justify-between rounded-lg px-1 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
              >
                <span>
                  {showUnavailable ? 'Ẩn' : 'Xem thêm'} {unavailableOffers.length} ưu đãi chưa đủ điều kiện
                </span>
                <ChevronRightIcon
                  className={`h-4 w-4 shrink-0 transition-transform ${showUnavailable ? 'rotate-90' : ''}`}
                />
              </button>
              {showUnavailable ? (
                <div className="space-y-3">
                  {unavailableOffers.map((offer) => (
                    <OfferCard
                      key={offer.code}
                      offer={offer}
                      selected={false}
                      disabled
                      onSelect={() => undefined}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-xl bg-slate-50 py-8 text-center">
          <EmptyOfferIllustration className="mb-4 h-24 w-24 text-slate-300" />
          <p className="max-w-[16rem] text-sm text-slate-500">{emptyHint}</p>
        </div>
      )}
    </div>
  )
}
