interface ConcernsStepProps {
  concerns: string[]
  pastProducts: string
  onToggleConcern: (c: string) => void
  onPastProductsChange: (v: string) => void
  onNext: () => void
  onBack: () => void
}

const CONCERNS = [
  'Acne / breakouts',
  'Dark spots / hyperpigmentation',
  'Fine lines / wrinkles',
  'Redness / rosacea',
  'Dullness / uneven texture',
  'Large pores',
  'Dryness / dehydration',
  'Dark circles',
  'Sun damage',
  'Uneven skin tone',
]

export default function ConcernsStep({
  concerns,
  pastProducts,
  onToggleConcern,
  onPastProductsChange,
  onNext,
  onBack,
}: ConcernsStepProps) {
  return (
    <div>
      <div className="mb-7">
        <p className="text-xs uppercase tracking-widest text-sage-600 mb-1.5">Step 2 of 4</p>
        <h2 className="font-serif text-2xl font-medium text-gray-900">Your skin concerns</h2>
        <p className="text-gray-500 mt-1.5 text-sm">Pick everything that applies.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {CONCERNS.map((c) => (
          <button
            key={c}
            onClick={() => onToggleConcern(c)}
            className={`chip ${concerns.includes(c) ? 'selected' : ''}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Products you&apos;ve tried — what worked and what didn&apos;t
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Be specific about reactions or breakouts — Skinvra will actively avoid ingredients
          that caused issues and prioritize what your skin liked.
        </p>
        <textarea
          className="input-base resize-none"
          rows={4}
          value={pastProducts}
          onChange={(e) => onPastProductsChange(e.target.value)}
          placeholder="e.g. CeraVe moisturizer worked great. The Ordinary niacinamide broke me out badly. Paula's Choice BHA was too harsh and caused peeling."
        />
      </div>

      <div className="flex gap-3">
        <button className="btn-secondary" onClick={onBack}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button className="btn-primary" onClick={onNext}>
          Continue
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
