import type { ScoredProduct } from '@/lib/types'
import ProductCard from './ProductCard'

interface ResultsStepProps {
  products: ScoredProduct[]
  error: string | null
  skinType: string
  onRestart: () => void
}

export default function ResultsStep({ products, error, skinType, onRestart }: ResultsStepProps) {
  const cleanCount = products.filter((p) => p.isClean).length

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs uppercase tracking-widest text-sage-600 mb-1.5">Your results</p>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-medium text-gray-900">
            Picks for {skinType} skin
          </h2>
          {products.length > 0 && (
            <span className="text-sm text-gray-400 shrink-0 pb-0.5">
              {cleanCount} of {products.length} fully clean
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {products.length === 0 && !error && (
        <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-500 mb-6 text-center">
          No products matched your filters. Try broadening your budget or selecting &quot;Not sure — suggest&quot; for product type.
        </div>
      )}

      <div className="space-y-4 mb-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <button className="btn-secondary" onClick={onRestart}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Start over
      </button>
    </div>
  )
}
