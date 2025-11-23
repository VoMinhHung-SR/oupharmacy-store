export const locales = ['vi'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'vi'

export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  // en: 'English', // TODO: Uncomment this when I18N is enabled
}

