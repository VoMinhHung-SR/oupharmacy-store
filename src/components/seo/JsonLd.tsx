type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/** Renders schema.org JSON-LD for crawlers (Organization, Product, BreadcrumbList, …). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
