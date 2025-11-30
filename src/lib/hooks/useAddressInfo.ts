import { useState, useEffect, useCallback } from 'react'
import { getDistrictsByCity, type District } from '../services/location'

interface AddressState {
  districts: District[]
  cityId: number | null
  cityName: string
  districtName: string
  addressInput: string
  location: { lat: string; lng: string }
  selectedOption: any
}

export function useAddressInfo() {
  const [addressState, setAddressState] = useState<AddressState>({
    districts: [],
    cityId: null,
    cityName: '',
    districtName: '',
    addressInput: '',
    location: { lat: '', lng: '' },
    selectedOption: null,
  })

  useEffect(() => {
    const loadDistricts = async (cityId: number) => {
      const result = await getDistrictsByCity(cityId)
      if (result.data) {
        setAddressState((prev) => ({
          ...prev,
          districts: result.data || [],
        }))
      } else {
        setAddressState((prev) => ({
          ...prev,
          districts: [],
        }))
      }
    }

    if (addressState.cityId) {
      loadDistricts(addressState.cityId)
    }
  }, [addressState.cityId])

  const handleSetLocation = useCallback(() => {
    setAddressState((prev) => ({
      ...prev,
      location: { lat: '', lng: '' },
    }))
  }, [])

  const handleInputChange = useCallback((e: any, value: string) => {
    setAddressState((prev) => ({
      ...prev,
      addressInput: value || '',
    }))
  }, [])

  const handleChange = useCallback((e: any, value: any) => {
    if (value && typeof value === 'object') {
      setAddressState((prev) => ({
        ...prev,
        selectedOption: value,
        location: {
          lat: value.geometry?.coordinates?.[1]?.toString() || '',
          lng: value.geometry?.coordinates?.[0]?.toString() || '',
        },
      }))
    }
  }, [])

  const handleClearAddress = useCallback(() => {
    setAddressState((prev) => ({
      ...prev,
      addressInput: '',
      selectedOption: null,
      location: { lat: '', lng: '' },
    }))
  }, [])

  return {
    ...addressState,
    handleInputChange,
    handleChange,
    handleSetLocation,
    handleClearAddress,
    setCityId: (id: number | null) =>
      setAddressState((prev) => ({ ...prev, cityId: id })),
    setCityName: (name: string) =>
      setAddressState((prev) => ({ ...prev, cityName: name })),
    setDistrictName: (name: string) =>
      setAddressState((prev) => ({ ...prev, districtName: name })),
    setSelectedOption: (option: any) =>
      setAddressState((prev) => ({ ...prev, selectedOption: option })),
    locationGeo: addressState.location, // alias for location
  }
}

