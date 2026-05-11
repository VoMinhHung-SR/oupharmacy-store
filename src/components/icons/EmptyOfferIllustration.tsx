import React from "react"

interface EmptyOfferIllustrationProps {
  className?: string
}

/** Empty-state illustration for voucher / offer panels. */
export const EmptyOfferIllustration: React.FC<EmptyOfferIllustrationProps> = ({
  className,
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 38h56v40H20z" strokeLinecap="round" />
      <path d="M20 38L48 22l28 16" strokeLinecap="round" />
      <path d="M48 22v56" />
      <path
        d="M36 52h24"
        strokeLinecap="round"
        strokeDasharray="4 4"
        opacity="0.6"
      />
    </svg>
  )
}
