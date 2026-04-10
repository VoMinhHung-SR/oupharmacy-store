'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useOrders } from '@/lib/hooks/useOrders'
import type { Order, OrderListResponse } from '@/lib/services/orders'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { OrderIcon } from '@/components/icons'
import { Pagination } from '@/components/Pagination'
import { AccountPageShell } from '@/components/account/AccountPageShell'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'

const PAGE_SIZE = 10

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Đang chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  SHIPPING: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
}

type StatusFilter = 'ALL' | Order['status']

export default function OrdersListPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const { openModal, isOpen } = useLoginModal()

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchText.trim())
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchText])

  const apiFilters = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
      ordering: sortOrder === 'newest' ? '-created_date' : 'created_date',
      ...(debouncedSearch ? { search: debouncedSearch, order_number: debouncedSearch } : {}),
    }),
    [page, statusFilter, sortOrder, debouncedSearch]
  )

  const { data: ordersData, isLoading, error } = useOrders(user?.id, apiFilters)

  useEffect(() => {
    setPage(1)
  }, [statusFilter, sortOrder, debouncedSearch])

  useEffect(() => {
    if (!loading && !isAuthenticated && !isOpen) {
      openModal('/tai-khoan/don-hang')
    }
  }, [isAuthenticated, loading, openModal, isOpen])

  const { orders, totalCount, rawEmpty, filteredEmpty } = useMemo(() => {
    if (!ordersData) {
      return { orders: [] as Order[], totalCount: 0, rawEmpty: true, filteredEmpty: false }
    }

    if (Array.isArray(ordersData)) {
      let list = [...ordersData] as Order[]
      const rawEmpty = list.length === 0
      if (statusFilter !== 'ALL') {
        list = list.filter((o) => o.status === statusFilter)
      }
      if (debouncedSearch) {
        const needle = debouncedSearch.toLowerCase()
        list = list.filter((o) => (o.order_number || `${o.id || ''}`).toLowerCase().includes(needle))
      }
      list.sort((a, b) => {
        const ta = new Date(a.created_date || 0).getTime()
        const tb = new Date(b.created_date || 0).getTime()
        return sortOrder === 'newest' ? tb - ta : ta - tb
      })
      const total = list.length
      const start = (page - 1) * PAGE_SIZE
      const slice = list.slice(start, start + PAGE_SIZE)
      return {
        orders: slice,
        totalCount: total,
        rawEmpty,
        filteredEmpty: !rawEmpty && total === 0,
      }
    }

    const pr = ordersData as OrderListResponse
    let results = (pr.results || []) as Order[]
    if (debouncedSearch) {
      const needle = debouncedSearch.toLowerCase()
      results = results.filter((o) => (o.order_number || `${o.id || ''}`).toLowerCase().includes(needle))
    }
    const total = debouncedSearch ? results.length : typeof pr.count === 'number' ? pr.count : results.length
    const noResult = results.length === 0
    return {
      orders: results,
      totalCount: total,
      rawEmpty: !debouncedSearch && noResult,
      filteredEmpty: !!debouncedSearch && noResult,
    }
  }, [ordersData, statusFilter, sortOrder, page, debouncedSearch])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  if (!isAuthenticated) {
    return null
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    )
  }

  const showTable = !isLoading && !error && orders.length > 0
  const showEmptyAll = !isLoading && !error && rawEmpty
  const showEmptyFilter = !isLoading && !error && filteredEmpty

  return (
    <AccountPageShell>
      <div className="space-y-6">
        <AccountPageHeader
          title="Đơn hàng của tôi"
          rightSlot={
            !isLoading && !error && !rawEmpty ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <span className="whitespace-nowrap">Mã đơn</span>
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="VD: ORD2026..."
                  className="w-52 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <span className="whitespace-nowrap">Trạng thái</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="PENDING">Đang chờ xử lý</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="SHIPPING">Đang giao hàng</option>
                  <option value="DELIVERED">Đã giao</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <span className="whitespace-nowrap">Sắp xếp</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="newest">Mới nhất trước</option>
                  <option value="oldest">Cũ nhất trước</option>
                </select>
              </label>
              </div>
            ) : null
          }
        />

        {isLoading && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách đơn hàng...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <p className="text-red-800">
              Có lỗi xảy ra khi tải danh sách đơn hàng: {error.message}
            </p>
          </div>
        )}

        {showEmptyAll && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="text-gray-400 mb-4">
              <OrderIcon className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào</p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        )}

        {showEmptyFilter && (
          <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
            <p className="text-gray-600 mb-4">
              {debouncedSearch
                ? `Không tìm thấy đơn hàng với mã "${debouncedSearch}".`
                : 'Không có đơn hàng phù hợp bộ lọc.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL')
                setSearchText('')
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {showTable && (
          <>
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="p-4 font-semibold text-gray-900">Mã đơn hàng</th>
                      <th className="p-4 font-semibold text-gray-900">Ngày đặt</th>
                      <th className="p-4 font-semibold text-gray-900">Tổng tiền</th>
                      <th className="p-4 font-semibold text-gray-900">Trạng thái</th>
                      <th className="p-4 font-semibold text-gray-900 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id ?? order.order_number} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <span className="font-medium text-gray-900">
                            {order.order_number || `#${order.id}`}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{formatDate(order.created_date)}</td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-900">
                            {order.total?.toLocaleString('vi-VN')}₫
                          </span>
                        </td>
                        <td className="p-4">{getStatusBadge(order.status)}</td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/tai-khoan/don-hang/${order.order_number ?? order.id}`}
                            className="text-primary-700 hover:text-primary-800 font-medium transition-colors"
                          >
                            Chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <p className="text-center text-xs text-gray-500">
              Hiển thị {orders.length} / {totalCount} đơn{totalPages > 1 ? ` · Trang ${page}/${totalPages}` : ''}
            </p>
          </>
        )}
      </div>
    </AccountPageShell>
  )
}
