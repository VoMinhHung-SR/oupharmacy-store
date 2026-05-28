type CountryTagProps = {
  label: string
  className?: string
}

/** Small origin pill (text only until flag assets exist). */
export function CountryTag({ label, className = '' }: CountryTagProps) {
  const text = label.trim()
  if (!text) return null

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 ${className}`.trim()}
    >
      {text}
    </span>
  )
}
