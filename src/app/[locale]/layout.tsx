import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import '../globals.css'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Container from '../../components/Container'
import { CartProvider } from '../../contexts/CartContext'
import { Providers } from '../providers'
import { locales } from '../../i18n/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OUPharmacy System',
  description: 'Hệ thống quản lý nhà thuốc OUPharmacy',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

