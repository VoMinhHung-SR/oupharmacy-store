import Link from 'next/link'
import HeroBanner from '@/sections/HeroBanner'
import FeaturedCategories from '@/sections/FeaturedCategories'
import FavoriteBrands from '@/sections/FavoriteBrands'
import BestsellingProducts from '@/sections/BestsellingProducts'
import PromotionalBanners from '@/sections/PromotionalBanners'
import { HOME_QUICK_LINKS } from '@/lib/constant'

export default async function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroBanner />

      <FeaturedCategories />

      <FavoriteBrands />

      <BestsellingProducts />

      <PromotionalBanners />

      <section className="py-12 bg-white" aria-label="Lối tắt dịch vụ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HOME_QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-primary-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span className="text-4xl mb-2" aria-hidden>
                  {link.icon}
                </span>
                <span className="text-sm font-medium text-gray-900 text-center">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
