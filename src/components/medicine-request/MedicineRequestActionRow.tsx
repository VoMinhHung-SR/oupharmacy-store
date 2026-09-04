type MedicineRequestActionRowProps = {
  title: string
  description: string
  onClick: () => void
  className?: string
}

export function MedicineRequestActionRow({
  title,
  description,
  onClick,
  className = '',
}: MedicineRequestActionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50/40 sm:gap-4 sm:px-5 sm:py-4 ${className}`}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-primary-700 sm:text-base">{title}</span>
        <span className="mt-0.5 block text-xs text-slate-500 sm:text-sm">{description}</span>
      </span>
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-lg font-medium leading-none text-primary-600 sm:h-9 sm:w-9 sm:text-xl"
        aria-hidden
      >
        +
      </span>
    </button>
  )
}
