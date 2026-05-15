'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormHandleSubmit,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormGetValues,
  type UseFormWatch,
} from 'react-hook-form'
import type { CheckoutInformation } from '@/contexts/CheckoutContext'
import { useCommonCities } from '@/contexts/CommonCitiesContext'
import type { CheckoutInformationFormData } from '@/lib/validations/checkout'
import { getCities, getDistrictsByCity, type City, type District } from '@/lib/services/location'
import { UserIcon, LocationIcon } from '@/components/icons'
import { toastError } from '@/lib/utils/toast'
import { SelectField, TextField } from '@/components/TextField'

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
      {icon}
      {title}
    </h2>
  )
}

interface CheckoutInfoSectionProps {
  register: UseFormRegister<CheckoutInformationFormData>
  control: Control<CheckoutInformationFormData>
  watch: UseFormWatch<CheckoutInformationFormData>
  setValue: UseFormSetValue<CheckoutInformationFormData>
  getValues: UseFormGetValues<CheckoutInformationFormData>
  errors: FieldErrors<CheckoutInformationFormData>
  onSubmit: (data: CheckoutInformationFormData) => void
  handleSubmit: UseFormHandleSubmit<CheckoutInformationFormData>
  notes: string
  onNotesChange: (value: string) => void
  savedInfo: CheckoutInformation | null
}

export function CheckoutInfoSection({
  register,
  control,
  watch,
  setValue,
  getValues,
  errors,
  onSubmit,
  handleSubmit,
  notes,
  onNotesChange,
  savedInfo,
}: CheckoutInfoSectionProps) {
  const { cities: ssrCities, citiesError } = useCommonCities()
  const [cities, setCities] = useState<City[]>(ssrCities)
  const [citiesReady, setCitiesReady] = useState(() => ssrCities.length > 0)
  const [communes, setCommunes] = useState<District[]>([])
  const [loadingCommunes, setLoadingCommunes] = useState(false)
  const restoredKeyRef = useRef<string | null>(null)

  const cityId = watch('city_id')
  const loadingCities = !citiesReady

  useEffect(() => {
    setCities(ssrCities)
    if (ssrCities.length > 0) setCitiesReady(true)
  }, [ssrCities])

  useEffect(() => {
    if (ssrCities.length > 0 || citiesReady) return
    let cancelled = false
    ;(async () => {
      const res = await getCities()
      if (cancelled) return
      if (res.data?.length) {
        setCities(res.data)
      } else {
        if (res.error) toastError(res.error)
        else if (citiesError) toastError(citiesError)
      }
      setCitiesReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [ssrCities.length, citiesReady, citiesError])

  useEffect(() => {
    const id = Number(cityId)
    if (!cityId || !Number.isFinite(id) || id < 1) {
      setCommunes([])
      return
    }
    let cancelled = false
    ;(async () => {
      setLoadingCommunes(true)
      const res = await getDistrictsByCity(id)
      if (cancelled) return
      setCommunes(res.data ?? [])
      if (res.error) toastError(res.error)
      setLoadingCommunes(false)
    })()
    return () => {
      cancelled = true
    }
  }, [cityId])

  useEffect(() => {
    if (!savedInfo?.city_id || cities.length === 0) return
    const key = `${savedInfo.city_id}:${savedInfo.commune_id ?? ''}`
    if (restoredKeyRef.current === key) return
    if (getValues('city_id')) return
    restoredKeyRef.current = key
    setValue('city_id', String(savedInfo.city_id))
    if (savedInfo.province) setValue('province', savedInfo.province)
  }, [cities.length, savedInfo?.city_id, savedInfo?.commune_id, savedInfo?.province, setValue, getValues])

  useEffect(() => {
    if (!savedInfo?.commune_id || communes.length === 0) return
    const row = communes.find((c) => String(c.id) === String(savedInfo.commune_id))
    if (row && getValues('commune_id') !== String(row.id)) {
      setValue('commune_id', String(row.id))
      setValue('ward', row.name)
    }
  }, [communes, savedInfo?.commune_id, setValue, getValues])

  useEffect(() => {
    if (!savedInfo?.city_id) restoredKeyRef.current = null
  }, [savedInfo?.city_id])

  return (
    <section className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.06)] sm:p-6">
      <form
        onSubmit={handleSubmit(onSubmit, (errs) => {
          const first = Object.values(errs)[0]
          if (first?.message) toastError(first.message as string)
        })}
        className="space-y-6"
      >
        <div>
          <SectionTitle icon={<UserIcon className="h-5 w-5 shrink-0 text-primary-600" />} title="Thông tin người đặt" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              variant="outline"
              id="checkout-name"
              placeholder="Họ và tên người đặt"
              autoComplete="name"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name')}
            />
            <TextField
              variant="outline"
              id="checkout-phone"
              type="tel"
              placeholder="Số điện thoại"
              autoComplete="tel"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              {...register('phone')}
            />
            <TextField
              variant="outline"
              id="checkout-email"
              type="email"
              placeholder="Email (không bắt buộc)"
              autoComplete="email"
              containerClassName="sm:col-span-2"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <SectionTitle icon={<LocationIcon className="h-5 w-5 shrink-0 text-primary-600" />} title="Thông tin nhận hàng" />

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              variant="outline"
              id="checkout-recipient-name"
              placeholder="Họ và tên người nhận"
              autoComplete="section-shipping name"
              error={!!errors.recipient_name}
              helperText={errors.recipient_name?.message}
              {...register('recipient_name')}
            />
            <TextField
              variant="outline"
              id="checkout-recipient-phone"
              type="tel"
              placeholder="Số điện thoại"
              autoComplete="section-shipping tel"
              error={!!errors.recipient_phone}
              helperText={errors.recipient_phone?.message}
              {...register('recipient_phone')}
            />
          </div>

          <p className="mt-3 rounded-lg border border-sky-100 bg-sky-50/90 px-3 py-2 text-xs leading-snug text-sky-900 sm:text-sm">
            Địa chỉ theo <span className="font-semibold">ranh giới hành chính sau sáp nhập</span>.
          </p>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Controller
              name="city_id"
              control={control}
              render={({ field }) => (
                <SelectField
                  {...field}
                  variant="outline"
                  id="checkout-city-id"
                  disabled={loadingCities}
                  error={!!errors.city_id}
                  helperText={errors.city_id?.message}
                  onChange={(e) => {
                    const v = e.target.value
                    field.onChange(v)
                    setValue('commune_id', '')
                    setValue('ward', '')
                    setValue('district', '')
                    const name = cities.find((c) => String(c.id) === v)?.name
                    setValue('province', name || '')
                  }}
                >
                  <option value="">{loadingCities ? 'Đang tải…' : 'Chọn Tỉnh/Thành phố'}</option>
                  {cities.map((c) => (
                    <option key={c.id} value={String(c.id)} className="text-slate-900">
                      {c.name}
                    </option>
                  ))}
                </SelectField>
              )}
            />
            <Controller
              name="commune_id"
              control={control}
              render={({ field }) => (
                <SelectField
                  {...field}
                  variant="outline"
                  id="checkout-commune-id"
                  disabled={!cityId || loadingCommunes}
                  error={!!errors.commune_id}
                  helperText={errors.commune_id?.message}
                  onChange={(e) => {
                    const v = e.target.value
                    field.onChange(v)
                    const row = communes.find((c) => String(c.id) === v)
                    setValue('ward', row?.name || '')
                  }}
                >
                  <option value="">
                    {!cityId ? 'Chọn tỉnh/thành trước' : loadingCommunes ? 'Đang tải…' : 'Chọn Phường/Xã'}
                  </option>
                  {communes.map((c) => (
                    <option key={c.id} value={String(c.id)} className="text-slate-900">
                      {c.name}
                    </option>
                  ))}
                </SelectField>
              )}
            />
          </div>

          <div className="mt-3">
            <TextField
              variant="outline"
              id="checkout-address"
              placeholder="Nhập địa chỉ cụ thể"
              autoComplete="street-address"
              error={!!errors.address}
              helperText={errors.address?.message}
              {...register('address')}
            />
          </div>

          <div className="mt-3">
            <TextField
              variant="outline"
              id="checkout-notes-inline"
              label="Ghi chú (không bắt buộc)"
              multiline
              rows={2}
              maxLength={2000}
              placeholder="Ví dụ: Hãy gọi cho tôi 15 phút trước khi giao"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="ml-auto block rounded-lg bg-primary-100 px-4 py-2.5 text-sm font-medium text-primary-800 transition hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Lưu thông tin
        </button>
      </form>
    </section>
  )
}
