'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { TextField } from '@/components/TextField'
import {
  ConsultationInfoPanel,
  MedicineRequestMobileActions,
} from '@/components/medicine-request/ConsultationInfoPanel'
import { ConsultationGuideSheet } from '@/components/medicine-request/ConsultationGuideSheet'
import { MedicineRequestActionRow } from '@/components/medicine-request/MedicineRequestActionRow'
import { MedicineSearchModal } from '@/components/medicine-request/MedicineSearchModal'
import { SelectedMedicineList } from '@/components/medicine-request/SelectedMedicineList'
import type { SelectedMedicine } from '@/components/medicine-request/types'
import { useAuth } from '@/contexts/AuthContext'
import { submitContactMessage } from '@/lib/services/contact'
import {
  buildMedicineRequestMessage,
  medicineRequestDisplayName,
} from '@/lib/utils/medicineRequestMessage'
import { toastError, toastSuccess } from '@/lib/utils/toast'
import {
  medicineRequestSchema,
  type MedicineRequestFormData,
} from '@/lib/validations/medicineRequest'

export function DatThuocWorkspace() {
  const { user } = useAuth()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [items, setItems] = useState<SelectedMedicine[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicineRequestFormData>({
    resolver: yupResolver(medicineRequestSchema),
    defaultValues: { fullName: '', phone: '', note: '' },
  })

  useEffect(() => {
    if (!user) return
    reset({
      fullName: medicineRequestDisplayName(user),
      phone: user.phone_number || '',
      note: '',
    })
  }, [user, reset])

  const onSubmit = async (values: MedicineRequestFormData) => {
    setIsSubmitting(true)
    try {
      const result = await submitContactMessage({
        name: values.fullName.trim(),
        phone: values.phone.trim(),
        email: user?.email?.trim() || undefined,
        subject: 'Cần mua thuốc',
        request_type: 'medicine',
        message: buildMedicineRequestMessage(values.note, items),
      })
      if (result.error) {
        toastError(result.error)
        return
      }
      toastSuccess('Gửi yêu cầu thành công, dược sĩ sẽ liên hệ trong thời gian sớm nhất')
      reset({
        fullName: medicineRequestDisplayName(user),
        phone: user?.phone_number || '',
        note: '',
      })
      setItems([])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <header className="mb-4 sm:mb-5">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl md:text-2xl">
            Cần mua thuốc
          </h1>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="shrink-0 text-sm font-medium text-primary-700 hover:underline lg:hidden"
          >
            Xem hướng dẫn
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Điền thông tin liên hệ, dược sĩ sẽ gọi lại tư vấn miễn phí.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid items-start gap-4 lg:grid-cols-12 lg:gap-8">
          <div className="relative z-10 space-y-3 sm:space-y-4 lg:col-span-8">
            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="space-y-4 p-4 sm:space-y-5 sm:p-5">
                <h2 className="text-sm font-semibold text-slate-800">Thông tin liên hệ</h2>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5">
                  <TextField
                    variant="outline"
                    label="Họ và tên"
                    placeholder="Nhập họ và tên"
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    fullWidth
                    {...register('fullName')}
                  />
                  <TextField
                    variant="outline"
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    type="tel"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    fullWidth
                    {...register('phone')}
                  />
                  <div className="sm:col-span-2">
                    <TextField
                      variant="outline"
                      label="Ghi chú (không bắt buộc)"
                      placeholder="Ví dụ: Tôi cần tư vấn thuốc về bệnh đau dạ dày"
                      multiline
                      rows={4}
                      error={!!errors.note}
                      helperText={errors.note?.message}
                      fullWidth
                      {...register('note')}
                    />
                  </div>
                </div>
              </div>
            </section>

            <div>
              <MedicineRequestActionRow
                title="Thêm thuốc cần tư vấn (không bắt buộc)"
                description="Nhập theo tên thuốc hoặc sản phẩm"
                onClick={() => setPickerOpen(true)}
                className={items.length > 0 ? 'rounded-b-none shadow-none' : ''}
              />
              {items.length > 0 ? (
                <SelectedMedicineList
                  items={items}
                  onRemove={(productId) =>
                    setItems((prev) => prev.filter((item) => item.productId !== productId))
                  }
                />
              ) : null}
            </div>

            <MedicineRequestMobileActions isSubmitting={isSubmitting} />
          </div>

          <div className="relative z-10 hidden lg:col-span-4 lg:block lg:sticky lg:top-28">
            <ConsultationInfoPanel isSubmitting={isSubmitting} />
          </div>
        </div>
      </form>

      <ConsultationGuideSheet open={guideOpen} onClose={() => setGuideOpen(false)} />

      <MedicineSearchModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selected={items}
        onComplete={(next) => {
          setItems(next)
          setPickerOpen(false)
        }}
      />
    </>
  )
}
