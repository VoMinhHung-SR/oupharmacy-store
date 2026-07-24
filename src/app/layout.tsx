import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'
import Header from '@/layouts/Header'
import NavigationBarWrapper from '@/layouts/NavigationBarWrapper'
import Footer from '@/layouts/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CheckoutProvider } from '@/contexts/CheckoutContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { LoginModalProvider } from '@/contexts/LoginModalContext'
import { LoginModal } from '@/components/modals/LoginModal'
import { Providers } from './providers'
import { fetchCommonCitiesServer } from '@/lib/services/location.server'

const inter = Inter({ subsets: ['latin'] })

const APP_NAME = 'OUPharmacy'
const APP_TITLE = 'OUPharmacy Store'
const APP_DESCRIPTION = 'Nhà thuốc OUPharmacy — mua thuốc, tư vấn và đặt hàng trực tuyến'

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/assets/logo_oupharmacy.ico', sizes: 'any' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/assets/logo_oupharmacy.ico',
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0369a1',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()
  const { cities: initialCities, error: initialCitiesError } = await fetchCommonCitiesServer()

  return (
    <html lang="vi">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers initialCities={initialCities} initialCitiesError={initialCitiesError}>
            <AuthProvider>
              <LoginModalProvider>
              <CartProvider>
                <WishlistProvider>
                  <CheckoutProvider>
                    <Header />
                    <NavigationBarWrapper />
                    <main className="relative z-0 bg-[#ededed] border-0">
                      {children}
                    </main>
                    <Footer />
                      <LoginModal />
                  </CheckoutProvider>
                </WishlistProvider>
              </CartProvider>
              </LoginModalProvider>
            </AuthProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
