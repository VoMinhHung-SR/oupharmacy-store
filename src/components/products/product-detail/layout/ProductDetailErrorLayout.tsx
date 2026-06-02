import Breadcrumb from '@/components/Breadcrumb'
import { Container } from '@/components/Container'

interface ProductDetailErrorLayoutProps {
  message?: string
}

export function ProductDetailErrorLayout({ message }: ProductDetailErrorLayoutProps) {
  return (
    <Container className="pb-6">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Sản phẩm', href: '/tim-kiem' },
        ]}
        className="py-4"
      />
      <div className="rounded-lg bg-white p-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="mb-2 text-lg font-medium text-amber-800">
            {message ? 'Không thể tải thông tin sản phẩm' : 'Không tìm thấy sản phẩm'}
          </p>
          <p className="mb-4 text-sm text-amber-700">
            {message ||
              'Sản phẩm không tồn tại hoặc không thuộc danh mục trong đường dẫn URL này.'}
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="/"
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm text-white transition-colors hover:bg-amber-700"
            >
              Về trang chủ
            </a>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm text-amber-700 transition-colors hover:bg-amber-50"
            >
              Tải lại
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
}
