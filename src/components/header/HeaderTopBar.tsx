'use client'

import Container from '@/components/Container'
import { HeaderAppDownloadPopover } from '@/components/header/HeaderAppDownloadPopover'
import { HeaderTopBarConsultLink } from '@/components/header/HeaderTopBarConsultLink'
import { topBarTextClass } from '@/components/header/topBarStyles'
import { STORE_SUPPORT } from '@/lib/constant'
import { getClinicBookingUrl } from '@/lib/siteUrls'
import { useTranslations } from 'next-intl'

export function HeaderTopBar() {
  const t = useTranslations('header')

  return (
    <div className="hidden border-b border-white/10 bg-primary-700/80 text-white lg:block">
      <Container>
        <div className="flex h-9 items-center justify-between gap-4">
          <a
            href={getClinicBookingUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={topBarTextClass}
          >
            {t('bookAppointment')}
          </a>

          <div className="flex items-center gap-5">
            <HeaderAppDownloadPopover />
            <HeaderTopBarConsultLink
              display={STORE_SUPPORT.HOTLINE_DISPLAY}
              tel={STORE_SUPPORT.HOTLINE_TEL}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}
