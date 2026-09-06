import type { ComponentType } from 'react'
import {
  ArrowsExchangeIcon,
  ReceiptRefundIcon,
  TruckDeliveryIcon,
} from '@/components/icons/commerce'
import type { SvgIconProps } from '@/components/icons/types'

export type ProductDetailPolicy = {
  title: string
  subtitle: string
  Icon: ComponentType<SvgIconProps>
}

/** PDP purchase-policy strip under the product gallery. */
export const PRODUCT_DETAIL_POLICIES: readonly ProductDetailPolicy[] = [
  {
    title: 'Đổi trả trong 30 ngày',
    subtitle: 'kể từ ngày mua hàng',
    Icon: ReceiptRefundIcon,
  },
  {
    title: 'Miễn phí 100%',
    subtitle: 'đổi thuốc',
    Icon: ArrowsExchangeIcon,
  },
  {
    title: 'Miễn phí vận chuyển',
    subtitle: 'theo chính sách giao hàng',
    Icon: TruckDeliveryIcon,
  },
] as const
