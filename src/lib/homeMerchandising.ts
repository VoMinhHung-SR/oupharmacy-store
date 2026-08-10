/**
 * Catalog/section mock lists until catalog APIs own home rails.
 * Placement CMS = Jazzmin active winners only (D-08 / D-20) — no mock fill on home slots.
 * Product images: same first-party catalog CDN hosts already allowed in next.config.
 */

/** Catalog packshots already on store CDN — not third-party stock. */
const IMG = {
  dmp: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/DSC_09119_4be9757d50.png',
  dmp2: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/DSC_04752_6e1556d733.jpg',
  tpcn: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/DSC_05505_4c243a16f9.jpg',
  tpcn2: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/DSC_05020_ce6da165fb.jpg',
  tbyt: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/00008483_urgo_transparent_100s_6901_62b5_large_e18589b5dc',
  eye: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/00502674_dung_dich_nho_mat_vrohto_dryeye_13ml_ho_tro_boi_',
  mask: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/jmsolution_15c0e75bd2.jpg',
  cream: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/DSC_08535_3b19b80977.jpg',
}

export type HomeMockProduct = {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image_url?: string
  packaging?: string
  href: string
  brand_country?: string | null
  in_stock?: number
}

export type HomeBrandCard = {
  id: string
  name: string
  href: string
  productImage?: string
  discountPercent: number
}

export const HOME_MOCK_HOT_PRODUCTS: HomeMockProduct[] = [
  {
    id: 'hot-1',
    name: 'Mặt nạ JMSolution Placen Lanolin dưỡng ẩm',
    price: 154000,
    originalPrice: 220000,
    discount: 30,
    image_url: IMG.mask,
    packaging: 'Hộp 10 miếng',
    href: '/tim-kiem?q=00044792',
    brand_country: 'Hàn Quốc',
    in_stock: 22,
  },
  {
    id: 'hot-2',
    name: 'Nhỏ mắt V.Rohto Dryeye 13ml',
    price: 42000,
    originalPrice: 52000,
    discount: 19,
    image_url: IMG.eye,
    packaging: 'Chai 13ml',
    href: '/tim-kiem?q=00502674',
    brand_country: 'Nhật Bản',
    in_stock: 30,
  },
  {
    id: 'hot-3',
    name: 'Sữa rửa mặt ngừa mụn Teenilicious 60g',
    price: 89000,
    originalPrice: 129000,
    discount: 31,
    image_url: IMG.dmp,
    packaging: 'Tuýp 60g',
    href: '/tim-kiem?q=00049302',
    brand_country: 'Hàn Quốc',
    in_stock: 20,
  },
  {
    id: 'hot-4',
    name: 'Sữa rửa mặt thảo dược Sắc Ngọc Khang 100g',
    price: 79000,
    originalPrice: 99000,
    discount: 20,
    image_url: IMG.dmp2,
    packaging: 'Tuýp 100g',
    href: '/tim-kiem?q=00046582',
    brand_country: 'Việt Nam',
    in_stock: 18,
  },
  {
    id: 'hot-5',
    name: 'Viên uống vitamin tổng hợp Immuvita',
    price: 245000,
    originalPrice: 350000,
    discount: 30,
    image_url: IMG.tpcn,
    packaging: 'Hộp 60 viên',
    href: '/tim-kiem?q=00045954',
    brand_country: 'Mỹ',
    in_stock: 12,
  },
  {
    id: 'hot-6',
    name: 'Kem dưỡng ẩm sáng da Fixderma Face21 50g',
    price: 270900,
    originalPrice: 387000,
    discount: 30,
    image_url: IMG.cream,
    packaging: 'Hộp 50g',
    href: '/tim-kiem?q=00043046',
    brand_country: 'Ấn Độ',
    in_stock: 9,
  },
]

/** Voucher % desc — until brand API exists. */
export const HOME_MOCK_BRANDS: HomeBrandCard[] = [
  { id: 'b1', name: 'JpanWell', href: '/brands/jpanwell', productImage: IMG.tpcn, discountPercent: 35 },
  { id: 'b2', name: 'Sắc Ngọc Khang', href: '/brands/sac-ngoc-khang', productImage: IMG.dmp2, discountPercent: 28 },
  { id: 'b3', name: 'JMSolution', href: '/brands/jmsolution', productImage: IMG.mask, discountPercent: 25 },
  { id: 'b4', name: 'Brauer', href: '/brands/brauer', productImage: IMG.tpcn2, discountPercent: 20 },
  { id: 'b5', name: 'Urgo', href: '/brands/urgo', productImage: IMG.tbyt, discountPercent: 18 },
].sort((a, b) => b.discountPercent - a.discountPercent)
