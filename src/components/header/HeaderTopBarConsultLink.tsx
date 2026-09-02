'use client'

import { useTranslations } from 'next-intl'
import { topBarTextClass } from '@/components/header/topBarStyles'

interface HeaderTopBarConsultLinkProps {
  display: string
  tel: string
}

export function HeaderTopBarConsultLink({ display, tel }: HeaderTopBarConsultLinkProps) {
  const t = useTranslations('header')

  return (
    <a href={`tel:${tel}`} className={topBarTextClass}>
      {t('consultNow')}: <span className="font-bold">{display}</span>
    </a>
  )
}
