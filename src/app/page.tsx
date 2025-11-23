import HeroBanner from '@/sections/HeroBanner'
import FeaturedCategories from '@/sections/FeaturedCategories'
import FavoriteBrands from '@/sections/FavoriteBrands'
import BestsellingProducts from '@/sections/BestsellingProducts'
import PromotionalBanners from '@/sections/PromotionalBanners'

export default async function Home() {
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Favorite Brands */}
      <FavoriteBrands />

      {/* Bestselling Products */}
      <BestsellingProducts />

      {/* Promotional Banners */}
      <PromotionalBanners />

      {/* Quick Links Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '💊', title: 'Cần mua thuốc', href: '/products' },
              { icon: '👨‍⚕️', title: 'Tư vấn với Dược Sỹ', href: '/consultation' },
              { icon: '📄', title: 'Đơn của tôi', href: '/account/orders' },
              { icon: '📍', title: 'Tìm nhà thuốc', href: '/pharmacies' },
              { icon: '💉', title: 'Tiêm Vắc xin', href: '/vaccination' },
              { icon: '🔍', title: 'Tra thuốc chính hãng', href: '/verify' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-primary-500 transition-all"
              >
                <div className="text-4xl mb-2">{link.icon}</div>
                <div className="text-sm font-medium text-gray-900 text-center">{link.title}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

