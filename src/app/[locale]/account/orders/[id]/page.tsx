import React from 'react'

interface Props {
  params: { id: string }
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = params
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Chi tiết đơn hàng {id}</h1>
      <div className="rounded border p-4 text-sm text-gray-600">Nội dung đơn hàng (placeholder)</div>
    </div>
  )
}


