import { getRequestConfig } from 'next-intl/server'
import { defaultLocale } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || defaultLocale

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  }
})

