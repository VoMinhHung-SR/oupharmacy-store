'use client'

import React, { useEffect, useState } from 'react'
import { Controller, Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { useCommonCities } from '@/contexts/CommonCitiesContext'
import { getDistrictsByCity } from '@/lib/services/location'
import { SelectField, TextField } from '@/components/TextField'

interface AddressFormData {
  location: {
    city: number
    district: number
    address: string
  }
}

interface AddressInfoFormProps {
  control: Control<AddressFormData>
  errors: FieldErrors<AddressFormData>
  setValue: UseFormSetValue<AddressFormData>
  watch: UseFormWatch<AddressFormData>
  isLoading: boolean
  onCityChange?: (cityId: number) => void
  onAddressInputChange?: (value: string) => void
}

export default function AddressInfoForm({
  control,
  errors,
  setValue,
  watch,
  isLoading,
  onCityChange,
  onAddressInputChange,
}: AddressInfoFormProps) {
  const { cities } = useCommonCities()
  const selectedCity = watch('location.city')
  const [districts, setDistricts] = useState<Array<{ id: number; name: string }>>([])

  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedCity && selectedCity > 0) {
        onCityChange?.(selectedCity)
        const result = await getDistrictsByCity(selectedCity)
        setDistricts(result.data ?? [])
      } else {
        setDistricts([])
        setValue('location.district', -1)
      }
    }
    loadDistricts()
  }, [selectedCity, setValue, onCityChange])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Thông tin địa chỉ</h2>
        <p className="text-sm text-gray-600 mb-4">Vui lòng nhập địa chỉ chính xác (sau sáp nhập).</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Controller
          name="location.city"
          control={control}
          render={({ field }) => (
            <SelectField
              {...field}
              variant="outline"
              id="register-city"
              disabled={isLoading}
              value={field.value > 0 ? field.value : ''}
              error={!!errors.location?.city}
              helperText={errors.location?.city?.message}
              onChange={(e) => {
                const value = Number(e.target.value)
                field.onChange(value > 0 ? value : -1)
                setValue('location.district', -1)
              }}
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </SelectField>
          )}
        />
        <Controller
          name="location.district"
          control={control}
          render={({ field }) => (
            <SelectField
              {...field}
              variant="outline"
              id="register-commune"
              disabled={!selectedCity || selectedCity <= 0 || isLoading}
              value={field.value > 0 ? field.value : ''}
              error={!!errors.location?.district}
              helperText={errors.location?.district?.message}
              onChange={(e) => field.onChange(Number(e.target.value))}
            >
              <option value="">{!selectedCity || selectedCity <= 0 ? 'Chọn tỉnh/thành trước' : 'Chọn Phường/Xã'}</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </SelectField>
          )}
        />
      </div>

      <Controller
        name="location.address"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outline"
            id="register-address"
            placeholder="Nhập địa chỉ cụ thể"
            disabled={isLoading}
            error={!!errors.location?.address}
            helperText={errors.location?.address?.message}
            onChange={(e) => {
              field.onChange(e.target.value)
              onAddressInputChange?.(e.target.value)
            }}
          />
        )}
      />
    </div>
  )
}
