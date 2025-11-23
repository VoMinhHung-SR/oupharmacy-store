import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'
import Header from '@/layouts/Header'
import NavigationBar from '@/layouts/NavigationBar'
import Footer from '@/layouts/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OUPharmacy System',
  description: 'Hệ thống quản lý nhà thuốc OUPharmacy',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Load messages tiếng Việt
  const messages = await getMessages()

  return (
    <html lang="vi">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <CartProvider>
              <Header />
              <NavigationBar />
              <main className="bg-white">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

