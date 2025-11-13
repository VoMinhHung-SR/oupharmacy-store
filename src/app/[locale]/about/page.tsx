import { Card } from '@/components/Card'
import { Button } from '@/components/Button'

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">OUPharmacy</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                Trang chủ
              </a>
              <a href="/about" className="text-primary-600 font-semibold">
                Giới thiệu
              </a>
              <a href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
                Liên hệ
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Về chúng tôi
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              OUPharmacy System là giải pháp quản lý nhà thuốc hiện đại, 
              được phát triển để đáp ứng nhu cầu quản lý toàn diện của các nhà thuốc.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Chúng tôi cam kết cung cấp những giải pháp công nghệ tiên tiến 
                để giúp các nhà thuốc vận hành hiệu quả hơn, phục vụ bệnh nhân tốt hơn 
                và đóng góp vào sự phát triển của ngành y tế Việt Nam.
              </p>
              <p className="text-lg text-gray-600">
                Với đội ngũ phát triển giàu kinh nghiệm và hiểu biết sâu sắc về 
                ngành dược phẩm, chúng tôi tự tin mang đến những sản phẩm chất lượng cao.
              </p>
            </div>
            <div className="bg-primary-100 rounded-lg p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Chất lượng hàng đầu</h3>
                <p className="text-gray-600">
                  Sản phẩm được phát triển với tiêu chuẩn chất lượng cao nhất
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Giá trị cốt lõi
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card hover className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Đổi mới</h3>
                <p className="text-gray-600">
                  Luôn tìm kiếm và áp dụng những công nghệ mới nhất để cải thiện sản phẩm.
                </p>
              </Card>

              <Card hover className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tận tâm</h3>
                <p className="text-gray-600">
                  Đặt lợi ích của khách hàng lên hàng đầu trong mọi quyết định.
                </p>
              </Card>

              <Card hover className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tin cậy</h3>
                <p className="text-gray-600">
                  Xây dựng mối quan hệ dài hạn dựa trên sự tin tưởng và minh bạch.
                </p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Liên hệ với chúng tôi để tìm hiểu thêm về giải pháp OUPharmacy System
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Liên hệ ngay
              </Button>
              <Button variant="outline" size="lg">
                Xem demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
