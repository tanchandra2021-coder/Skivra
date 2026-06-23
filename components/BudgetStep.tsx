interface BudgetStepProps {
  budget: string
  productType: string
  extraNotes: string
  onBudgetChange: (v: string) => void
  onProductTypeChange: (v: string) => void
  onExtraNotesChange: (v: string) => void
  onSubmit: () => void
  onBack: () => void
  loading: boolean
}

const BUDGETS = ['Under $25', '$25–$50', '$50–$100', '$100+']

const PRODUCT_TYPES = [
  'Moisturizer', 'Serum', 'Cleanser', 'Sunscreen',
  'Toner', 'Eye cream', 'Exfoliant', 'Face oil',
  'Mask', 'Not sure — suggest',
]

export default function BudgetStep({
  budget, productType, extraNotes,
  onBudgetChange, onProductTypeChange, onExtraNotesChange,
  onSubmit, onBack, loading,
}: BudgetStepProps) {
  return (
    <div>
      <div className="mb-7">
        <p className="text-xs uppercase tracking-widest text-sage-600 mb-1.5">Step 3 of 4</p>
        <h2 className="font-serif text-2xl font-medium text-gray-900">Budget &amp; preferences</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Price range per product</label>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <button key={b} onClick={() => onBudgetChange(b)} className={`chip ${budget === b ? 'selected' : ''}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">What type of product?</label>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_TYPES.map((t) => (
            <button key={t} onClick={() => onProductTypeChange(t)} className={`chip ${productType === t ? 'selected' : ''}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Any other preferences? <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          className="input-base resize-none"
          rows={3}
          value={extraNotes}
          onChange={(e) => onExtraNotesChange(e.target.value)}
          placeholder="e.g. fragrance-free, vegan, cruelty-free, no silicones, reef-safe..."
        />
      </div>

      <div className="flex gap-3">
        <button className="btn-secondary" onClick={onBack} disabled={loading}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button className="btn-primary" onClick={onSubmit} disabled={loading || !productType || !budget}>
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              Find my products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
