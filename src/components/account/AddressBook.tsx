'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { SearchableSelect } from '@/components/common/SearchableSelect'
import { TextField } from '@/components/TextField'
import { LocationIcon, XIcon } from '@/components/icons'
import { useCommonCities } from '@/contexts/CommonCitiesContext'
import { useUserAddressMutations, useUserAddresses } from '@/lib/hooks/useUserAddresses'
import { getCities, getDistrictsByCity, type City, type District } from '@/lib/services/location'
import {
  USER_ADDRESS_LIMIT,
  formatUserAddressLine,
  placeInfo,
  type UserAddress,
} from '@/lib/services/userAddresses'
import { AddressBookSkeleton } from '@/components/skeletons'
import { toastError, toastSuccess } from '@/lib/utils/toast'

export function AddressBook() {
  const { data: addresses = [], isLoading, error } = useUserAddresses(true)
  const { createMutation, updateMutation, deleteMutation, setDefaultMutation } = useUserAddressMutations()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<UserAddress | null>(null)
  const busy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    setDefaultMutation.isPending
  const atLimit = addresses.length >= USER_ADDRESS_LIMIT

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toastSuccess('Đã xóa địa chỉ')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Xóa địa chỉ thất bại')
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultMutation.mutateAsync(id)
      toastSuccess('Đã đặt làm địa chỉ mặc định')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Cập nhật thất bại')
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? <AddressBookSkeleton /> : null}

      {!isLoading ? (
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="primary"
            disabled={busy || atLimit}
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
          >
            Thêm địa chỉ
          </Button>
        </div>
      ) : null}
      {!isLoading && atLimit ? (
        <p className="text-sm text-gray-600">Tối đa {USER_ADDRESS_LIMIT} địa chỉ. Xóa bớt để thêm mới.</p>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error.message}
        </div>
      ) : null}

      {!isLoading && !error && addresses.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center sm:p-8">
          <LocationIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <p className="mb-4 text-gray-600">Chưa có địa chỉ nào được lưu</p>
          <Button
            variant="primary"
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
          >
            Thêm địa chỉ đầu tiên
          </Button>
        </div>
      ) : null}

      {!isLoading && addresses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="relative rounded-lg border border-gray-200 bg-white p-5 hover:border-primary-500"
            >
              {address.is_default ? (
                <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                  Mặc định
                </span>
              ) : null}
              <p className="pr-20 text-sm leading-6 text-gray-800">{formatUserAddressLine(address)}</p>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => {
                    setEditing(address)
                    setShowForm(true)
                  }}
                >
                  Chỉnh sửa
                </Button>
                {!address.is_default ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Đặt mặc định
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  className="text-red-600 hover:border-red-300 hover:text-red-700"
                  onClick={() => handleDelete(address.id)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {showForm ? (
        <AddressFormModal
          address={editing}
          forceDefault={addresses.length === 0}
          onClose={closeForm}
          onCreate={async (payload) => {
            await createMutation.mutateAsync(payload)
            toastSuccess('Đã thêm địa chỉ')
            closeForm()
          }}
          onUpdate={async (id, payload) => {
            await updateMutation.mutateAsync({ id, payload })
            toastSuccess('Đã cập nhật địa chỉ')
            closeForm()
          }}
        />
      ) : null}
    </div>
  )
}

function AddressFormModal({
  address,
  forceDefault,
  onClose,
  onCreate,
  onUpdate,
}: {
  address: UserAddress | null
  forceDefault: boolean
  onClose: () => void
  onCreate: (payload: { address: string; city: number; district: number; is_default?: boolean }) => Promise<void>
  onUpdate: (
    id: number,
    payload: { address: string; city: number; district: number; is_default?: boolean }
  ) => Promise<void>
}) {
  const { cities: ssrCities, citiesError } = useCommonCities()
  const [cities, setCities] = useState<City[]>(ssrCities)
  const [citiesReady, setCitiesReady] = useState(() => ssrCities.length > 0)
  const [communes, setCommunes] = useState<District[]>([])
  const [loadingCommunes, setLoadingCommunes] = useState(false)
  const [street, setStreet] = useState(address?.address ?? '')
  const [cityId, setCityId] = useState(() => String(placeInfo(address?.city_info)?.id ?? ''))
  const [communeId, setCommuneId] = useState(() => String(placeInfo(address?.district_info)?.id ?? ''))
  const [isDefault, setIsDefault] = useState(Boolean(address?.is_default || forceDefault))
  const [saving, setSaving] = useState(false)

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
      if (res.data?.length) setCities(res.data)
      else if (res.error) toastError(res.error)
      else if (citiesError) toastError(citiesError)
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const city = Number(cityId)
    const district = Number(communeId)
    const addressText = street.trim()
    if (!addressText) {
      toastError('Vui lòng nhập địa chỉ cụ thể')
      return
    }
    if (!Number.isFinite(city) || city < 1) {
      toastError('Vui lòng chọn Tỉnh/Thành phố')
      return
    }
    if (!Number.isFinite(district) || district < 1) {
      toastError('Vui lòng chọn Phường/Xã')
      return
    }

    setSaving(true)
    try {
      const payload = {
        address: addressText,
        city,
        district,
        is_default: isDefault,
      }
      if (address) await onUpdate(address.id, payload)
      else await onCreate(payload)
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Lưu địa chỉ thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h2 className="text-xl font-semibold text-gray-900">
            {address ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <p className="rounded-lg border border-sky-100 bg-sky-50/90 px-3 py-2 text-xs leading-snug text-sky-900 sm:text-sm">
            Địa chỉ theo <span className="font-semibold">ranh giới hành chính sau sáp nhập</span>.
          </p>

          <SearchableSelect
            id="address-city-id"
            value={cityId}
            disabled={!citiesReady}
            placeholder={citiesReady ? 'Chọn Tỉnh/Thành phố' : 'Đang tải…'}
            searchPlaceholder="Nhập tìm Tỉnh/Thành phố"
            title="Chọn Tỉnh/Thành phố"
            options={cities.map((city) => ({ value: String(city.id), label: city.name }))}
            onChange={(value) => {
              setCityId(value)
              setCommuneId('')
            }}
          />

          <SearchableSelect
            id="address-commune-id"
            value={communeId}
            disabled={!cityId || loadingCommunes}
            placeholder={
              !cityId ? 'Chọn tỉnh/thành trước' : loadingCommunes ? 'Đang tải…' : 'Chọn Phường/Xã'
            }
            searchPlaceholder="Nhập tìm Phường/Xã"
            title="Chọn Phường/Xã"
            options={communes.map((row) => ({ value: String(row.id), label: row.name }))}
            onChange={setCommuneId}
          />

          <TextField
            variant="outline"
            id="address-street"
            placeholder="Nhập địa chỉ cụ thể"
            autoComplete="street-address"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
          />

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isDefault}
              disabled={forceDefault}
              onChange={(event) => setIsDefault(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Đặt làm địa chỉ mặc định
          </label>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <Button variant="outline" type="button" onClick={onClose} disabled={saving}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Đang lưu...' : address ? 'Cập nhật' : 'Thêm địa chỉ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
