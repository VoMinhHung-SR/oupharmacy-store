'use client'

import React from 'react'
import { SelectOptionPill } from '@/components/common/SelectOptionPill'

interface ProductUnitOptionButtonProps {
  label: string
  selected: boolean
  onSelect: () => void
}

/** Unit pill on PDP — uses shared SelectOptionPill (corner-check selected state). */
export function ProductUnitOptionButton({
  label,
  selected,
  onSelect,
}: ProductUnitOptionButtonProps) {
  return (
    <SelectOptionPill label={label} selected={selected} onSelect={onSelect} size="md" />
  )
}
