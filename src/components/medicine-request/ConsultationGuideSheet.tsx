'use client'

import { useId } from 'react'
import { OfferSheet } from '@/components/sheets'
import { Button } from '@/components/Button'
import { ConsultationProcessBody } from '@/components/medicine-request/consultationContent'

type ConsultationGuideSheetProps = {
  open: boolean
  onClose: () => void
}

export function ConsultationGuideSheet({ open, onClose }: ConsultationGuideSheetProps) {
  const titleId = useId()

  return (
    <OfferSheet
      open={open}
      onClose={onClose}
      titleId={titleId}
      title="Quy trình tư vấn tại OUPharmacy"
      panelClassName="!w-full !max-w-none sm:!w-[28rem] sm:!max-w-[28rem]"
      footer={
        <div className="border-t border-slate-100 px-5 py-4">
          <Button type="button" size="lg" className="w-full text-base" onClick={onClose}>
            Đã hiểu
          </Button>
        </div>
      }
    >
      <div className="px-5 py-4">
        <ConsultationProcessBody />
      </div>
    </OfferSheet>
  )
}
