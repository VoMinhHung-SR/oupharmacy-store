import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'OUPharmacy Store',
  description: 'Hệ thống quản lý nhà thuốc OUPharmacy',
  icons: {
    icon: [
      { url: '/assets/logo_oupharmacy.ico', sizes: 'any' },
    ],
    shortcut: '/assets/logo_oupharmacy.ico',
    apple: '/assets/logo_oupharmacy.ico',
  },
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

