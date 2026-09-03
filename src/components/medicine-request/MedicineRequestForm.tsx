'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { MedicineSearchModal } from '@/components/medicine-request/MedicineSearchModal'
import { SelectedMedicineList } from '@/components/medicine-request/SelectedMedicineList'
import type { SelectedMedicine } from '@/components/medicine-request/types'
import { useAuth } from '@/contexts/AuthContext'
import { submitContactMessage } from '@/lib/services/contact'
import { toastError, toastSuccess } from '@/lib/utils/toast'
import {
  medicineRequestSchema,
  type MedicineRequestFormData,
} from '@/lib/validations/medicineRequest'

function displayName(user: { first_name?: string; last_name?: string; name?: string } | null) {
  if (!user) return ''
  const combined = [user.first_name, user.last_name].filter(Boolean).join(' ').trim()
  return combined || user.name || ''
}

function buildMessage(note: string, items: SelectedMedicine[]) {
  const lines: string[] = []
  if (note.trim()) {
    lines.push('Ghi chú:', note.trim(), '')
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

export function MedicineRequestForm() {
  const { user } = useAuth()
  const [pickerOpen, setPickerOpen] = useState(false)
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
      fullName: displayName(user),
      phone: user.phone_number || '',
      note: '',
    })
  }, [user, reset])

  const onSubmit = async (values: MedicineRequestFormData) => {
    setIsSubmitting(true)
    const result = await submitContactMessage({
      name: values.fullName.trim(),
      phone: values.phone.trim(),
      email: user?.email?.trim() || undefined,
      subject: 'Cần mua thuốc',
      request_type: 'medicine',
      message: buildMessage(values.note, items),
    })
    setIsSubmitting(false)
    if (result.error) {
      toastError(result.error)
      return
    }
    toastSuccess('Gửi yêu cầu thành công, dược sĩ sẽ liên hệ trong thời gian sớm nhất')
    reset({
      fullName: displayName(user),
      phone: user?.phone_number || '',
      note: '',
    })
    setItems([])
  }

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Thông tin liên hệ</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              fullWidth
              {...register('fullName')}
            />
            <TextField
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              type="tel"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
              {...register('phone')}
            />
          </div>
          <div className="mt-4">
            <TextField
              label="Ghi chú (không bắt buộc)"
              placeholder="Ví dụ: Tôi cần tư vấn thuốc về bệnh đau dạ dày"
              multiline
              rows={4}
              labelPosition="above"
              error={!!errors.note}
              helperText={errors.note?.message}
              fullWidth
              {...register('note')}
            />
          </div>
        </section>

        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 text-left shadow-sm hover:border-primary-300"
          onClick={() => setPickerOpen(true)}
        >
          <span>
            <span className="block font-semibold text-gray-900">Thêm thuốc cần tư vấn (không bắt buộc)</span>
            <span className="mt-0.5 block text-sm text-gray-500">Nhập theo tên thuốc hoặc sản phẩm</span>
          </span>
          <span className="text-2xl font-light text-primary-600" aria-hidden>
            +
          </span>
        </button>

        <SelectedMedicineList
          items={items}
          onRemove={(productId) => setItems((prev) => prev.filter((item) => item.productId !== productId))}
        />

        <p className="text-xs text-gray-500">
          Nếu có đơn thuốc, quý khách mang theo khi dược sĩ gọi hoặc ghi thêm thông tin trong ghi chú.
        </p>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
        </Button>
      </form>

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
