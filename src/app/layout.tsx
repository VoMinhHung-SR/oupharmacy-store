import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Container from '../components/Container'
import { CartProvider } from '../contexts/CartContext'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OUPharmacy System',
  description: 'Hệ thống quản lý nhà thuốc OUPharmacy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            <Header />
            <main className="min-h-[60vh] py-6">
              <Container>
                {children}
              </Container>
            </main>
            <Footer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  )
}
