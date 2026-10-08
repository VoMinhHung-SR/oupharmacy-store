'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import Container from '@/components/Container'
import type { PlacementWinner } from '@/lib/services/campaign'
import CampaignHeroSlot from './CampaignHeroSlot'

const THEME_FADE_MS = 500
const THEME_IMG_QUALITY = 60

type CampaignHomeHeroClientProps = {
  slides: PlacementWinner[]
}

export default function CampaignHomeHeroClient({ slides }: CampaignHomeHeroClientProps) {
  const list = slides.slice(0, 2)
  const [heroIndex, setHeroIndex] = useState(0)
  const activeTheme = list[heroIndex]?.theme_image_url?.trim() || null

  return (
    <>
      <div aria-hidden className="home-cms-band-fade pointer-events-none absolute inset-0 -z-10">
        {list.map((slide, i) => {
          const src = slide.theme_image_url?.trim()
          if (!src) return null
          const active = i === heroIndex
          return (
            <Image
              key={`theme-${slide.campaign_id}-${i}`}
              src={src}
              alt=""
              fill
              sizes="100vw"
              quality={THEME_IMG_QUALITY}
              className="object-cover object-top transition-opacity ease-in-out"
              style={{
                opacity: active ? 1 : 0,
                transitionDuration: `${THEME_FADE_MS}ms`,
              }}
            />
          )
        })}
        {!activeTheme ? (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-transparent" />
        ) : null}
      </div>

      <Container className="relative z-10 pb-0 pt-3 sm:pt-4">
        <CampaignHeroSlot
          slides={list}
          embedded
          activeIndex={heroIndex}
          onActiveIndexChange={setHeroIndex}
        />
      </Container>
    </>
  )
}
