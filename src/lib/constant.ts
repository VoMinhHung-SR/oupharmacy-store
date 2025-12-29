export const STORAGE_KEY = {
  TOKEN: 'oupharmacy_token',
  REFRESH_TOKEN: 'oupharmacy_refresh_token',
  USER: 'oupharmacy_user',
}

export const TOAST_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

// Regex patterns
export const REGEX_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const REGEX_NAME =
  /^([a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệếỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựýỳỵỷỹ\s]+)$/

export const REGEX_ADDRESS =
  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệếỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựýỳỵỷỹ0-9,-/;|:\s]*$/

export const REGEX_PHONE_NUMBER =
  /^(0|\+?84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/

export const REGEX_STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const CURRENT_DATE = new Date()

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
} as const

// Product Listing
export const PRODUCT_LISTING = {
  GRID_COLS: {
    MOBILE: 2,
    TABLET: 3,
    DESKTOP: 4,
  },
  DEFAULT_SORT: 'bestselling' as const,
  DEFAULT_VIEW_MODE: 'grid' as const,
} as const

// Sidebar
export const SIDEBAR = {
  WIDTH: 256, // 64 * 4px = 256px (w-64)
  MOBILE_WIDTH: 256, // Same as desktop for mobile overlay
  STICKY_TOP: 32, // 8 * 4px = 32px (top-8)
  Z_INDEX_OVERLAY: 40,
  Z_INDEX_SIDEBAR: 50,
} as const

// Product Filters
export const PRODUCT_FILTERS = {
  TARGET_AUDIENCES: [
    { id: 'all', label: 'Tất cả' },
    { id: 'children', label: 'Trẻ em' },
    { id: 'adults', label: 'Người trưởng thành' },
    { id: 'elderly', label: 'Người lớn' },
    { id: 'seniors', label: 'Người cao tuổi' },
  ] as const,
  
  PRICE_RANGES: [
    { label: 'Dưới 100.000₫', min: 0, max: 100000 },
    { label: '100.000₫ đến 300.000₫', min: 100000, max: 300000 },
    { label: '300.000₫ đến 500.000₫', min: 300000, max: 500000 },
    { label: 'Trên 500.000₫', min: 500000, max: undefined },
  ] as const,
  
  FLAVORS: [
    { id: 'all', label: 'Tất cả' },
    { id: 'vanilla', label: 'Vani' },
    { id: 'orange', label: 'Vị Cam' },
    { id: 'strawberry', label: 'Vị Dâu' },
    { id: 'orange-scent', label: 'Hương cam' },
  ] as const,
  
  SORT_OPTIONS: [
    { value: 'bestselling', label: 'Bán chạy' },
    { value: 'price-low', label: 'Giá thấp' },
    { value: 'price-high', label: 'Giá cao' },
  ] as const,
} as const

export const PRICE_CONSULT = 'CONSULT' as const