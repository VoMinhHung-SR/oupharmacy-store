import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'
import Header from '@/layouts/Header'
import NavigationBar from '@/layouts/NavigationBar'
import Footer from '@/layouts/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CheckoutProvider } from '@/contexts/CheckoutContext'
import { Providers } from './providers'

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

  return (
    <html lang="vi">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <AuthProvider>
              <CartProvider>
                <CheckoutProvider>
                  <Header />
                  <NavigationBar />
                  <main className="bg-white">
                    {children}
                  </main>
                  <Footer />
                </CheckoutProvider>
              </CartProvider>
            </AuthProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

