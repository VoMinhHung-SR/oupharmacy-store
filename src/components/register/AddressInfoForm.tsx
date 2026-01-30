'use client'
import React, { useEffect } from 'react'
import { Controller, Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { getDistrictsByCity, type City } from '@/lib/services/location'

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
  cities: City[]
  onCityChange?: (cityId: number) => void
  onAddressInputChange?: (value: string) => void
}

export default function AddressInfoForm({
  control,
  errors,
  setValue,
  watch,
  isLoading,
  cities,
  onCityChange,
  onAddressInputChange,
}: AddressInfoFormProps) {
  const selectedCity = watch('location.city')
  const [districts, setDistricts] = React.useState<Array<{ id: number; name: string }>>([])

  // Load districts when city changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedCity && selectedCity > 0) {
        if (onCityChange) {
          onCityChange(selectedCity)
        }
        const result = await getDistrictsByCity(selectedCity)
        if (result.data) {
          setDistricts(result.data)
        }
      } else {
        setDistricts([])
        setValue('location.district', -1)
      }
    }
    loadDistricts()
  }, [selectedCity, setValue, onCityChange])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Thông tin địa chỉ</h2>
        <p className="text-sm text-gray-600 mb-4">(Vui lòng nhập địa chỉ chính xác)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Thành phố <span className="text-red-500">*</span>
          </label>
          <Controller
            name="location.city"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="city"
                onChange={(e) => {
                  const value = Number(e.target.value)
                  field.onChange(value)
                  setValue('location.district', -1)
                }}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.location?.city ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                disabled={isLoading}
              >
                <option value={-1}>Chọn thành phố</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.location?.city && (
            <p className="mt-1 text-xs text-red-600">{errors.location.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
            Quận/Huyện <span className="text-red-500">*</span>
          </label>
          <Controller
            name="location.district"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="district"
                onChange={(e) => {
                  field.onChange(Number(e.target.value))
                }}
                disabled={!selectedCity || selectedCity <= 0 || isLoading}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.location?.district ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
              >
                <option value={-1}>Chọn quận/huyện</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.location?.district && (
            <p className="mt-1 text-xs text-red-600">{errors.location.district.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ chi tiết <span className="text-red-500">*</span>
        </label>
        <Controller
          name="location.address"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id="address"
              type="text"
              placeholder="Nhập địa chỉ chi tiết"
              onChange={(e) => {
                field.onChange(e.target.value)
                if (onAddressInputChange) {
                  onAddressInputChange(e.target.value)
                }
              }}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.location?.address ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
              disabled={isLoading}
            />
          )}
        />
        {errors.location?.address && (
          <p className="mt-1 text-xs text-red-600">{errors.location.address.message}</p>
        )}
      </div>
    </div>
  )
}

