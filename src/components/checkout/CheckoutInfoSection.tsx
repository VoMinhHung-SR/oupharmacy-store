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
import { TextField } from '@/components/TextField'

const inputBase =
  'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed'
const inputError = 'border-red-300 focus:ring-red-500'
const inputNormal = 'border-slate-200'

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
  /** Để khôi phục tỉnh/phường sau reload (localStorage). */
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

  const loadingCities = !citiesReady

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
        className="space-y-8"
      >
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
            <UserIcon className="h-5 w-5 shrink-0 text-primary-600" />
            Thông tin người đặt
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-1">
              <TextField
                label="Họ và tên người đặt"
                required
                id="checkout-name"
                type="text"
                {...register('name')}
                autoComplete="name"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </div>
            <div className="md:col-span-1">
              <TextField
                label="Số điện thoại"
                required
                id="checkout-phone"
                type="tel"
                {...register('phone')}
                autoComplete="tel"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </div>
            <div className="md:col-span-2">
              <TextField
                label="Email (không bắt buộc)"
                id="checkout-email"
                type="email"
                {...register('email')}
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
            <LocationIcon className="h-5 w-5 shrink-0 text-primary-600" />
            Thông tin nhận hàng
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <TextField
                label="Họ và tên người nhận"
                required
                id="checkout-recipient-name"
                type="text"
                {...register('recipient_name')}
                autoComplete="section-shipping name"
                error={!!errors.recipient_name}
                helperText={errors.recipient_name?.message}
              />
            </div>
            <div>
              <TextField
                label="Số điện thoại"
                required
                id="checkout-recipient-phone"
                type="tel"
                {...register('recipient_phone')}
                autoComplete="section-shipping tel"
                error={!!errors.recipient_phone}
                helperText={errors.recipient_phone?.message}
              />
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-xs leading-relaxed text-sky-900 sm:text-sm">
            Địa chỉ nhập theo <span className="font-semibold">ranh giới hành chính sau sáp nhập</span> (không dùng
            địa danh trước sáp nhập). Chọn Tỉnh/Thành phố rồi Phường/Xã theo dữ liệu hệ thống.
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="checkout-city-id" className="mb-1 block text-sm font-medium text-slate-700">
                Tỉnh / Thành phố <span className="text-red-500">*</span>
              </label>
              <Controller
                name="city_id"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="checkout-city-id"
                    disabled={loadingCities}
                    onChange={(e) => {
                      const v = e.target.value
                      field.onChange(v)
                      setValue('commune_id', '')
                      setValue('ward', '')
                      setValue('district', '')
                      const name = cities.find((c) => String(c.id) === v)?.name
                      setValue('province', name || '')
                    }}
                    className={`${inputBase} ${errors.city_id ? inputError : inputNormal}`}
                  >
                    <option value="">{loadingCities ? 'Đang tải…' : 'Chọn Tỉnh/Thành phố'}</option>
                    {cities.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.city_id && <p className="mt-1 text-sm text-red-600">{errors.city_id.message}</p>}
            </div>
            <div>
              <label htmlFor="checkout-commune-id" className="mb-1 block text-sm font-medium text-slate-700">
                Phường / Xã <span className="text-red-500">*</span>
              </label>
              <Controller
                name="commune_id"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="checkout-commune-id"
                    disabled={!cityId || loadingCommunes}
                    onChange={(e) => {
                      const v = e.target.value
                      field.onChange(v)
                      const row = communes.find((c) => String(c.id) === v)
                      setValue('ward', row?.name || '')
                    }}
                    className={`${inputBase} ${errors.commune_id ? inputError : inputNormal}`}
                  >
                    <option value="">
                      {!cityId
                        ? 'Chọn tỉnh/thành trước'
                        : loadingCommunes
                          ? 'Đang tải…'
                          : 'Chọn Phường/Xã'}
                    </option>
                    {communes.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.commune_id && <p className="mt-1 text-sm text-red-600">{errors.commune_id.message}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="checkout-address" className="mb-1 block text-sm font-medium text-slate-700">
              Nhập địa chỉ cụ thể <span className="text-red-500">*</span>
            </label>
            <textarea
              id="checkout-address"
              {...register('address')}
              placeholder="Số nhà, tên đường, tòa nhà…"
              rows={3}
              className={`${inputBase} resize-none ${errors.address ? inputError : inputNormal}`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="checkout-notes-inline" className="mb-1 block text-sm font-medium text-slate-700">
              Ghi chú <span className="text-slate-400">(không bắt buộc)</span>
            </label>
            <p className="mb-2 text-xs text-slate-500">Ví dụ: gọi trước khi giao 15 phút.</p>
            <textarea
              id="checkout-notes-inline"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Ghi chú cho đơn hàng"
              rows={3}
              maxLength={2000}
              className={`${inputBase} resize-none ${inputNormal}`}
            />
          </div>
        </div>

        <button
          type="submit"
          className="ml-auto block rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800 transition hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Lưu thông tin
        </button>
      </form>
    </section>
  )
}
