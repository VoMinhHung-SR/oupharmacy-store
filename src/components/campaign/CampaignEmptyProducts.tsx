import Link from 'next/link'
import Container from '@/components/Container'

export interface CampaignEmptyProductsProps {
  message: string
  browseLabel: string
}

/** Empty state when campaign scope is empty or yields no visible products. */
export function CampaignEmptyProducts({
  message,
  browseLabel,
}: CampaignEmptyProductsProps) {
  return (
    <section className="py-12" aria-label={message}>
      <Container className="text-center">
        <p className="text-base text-gray-600">{message}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg border border-primary-600 px-5 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50"
        >
          {browseLabel}
        </Link>
      </Container>
    </section>
  )
}
