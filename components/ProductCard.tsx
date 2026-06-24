import type { ScoredProduct } from '@/lib/types'

interface ProductCardProps {
  product: ScoredProduct
}

const SEVERITY_COLORS = {
  high:   'bg-red-50 text-red-700 border-red-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  low:    'bg-gray-50 text-gray-600 border-gray-100',
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, brand, price, concerns, flags, isClean, cleanScore, rating, reviewCount, scoreBreakdown } = product

  const shopLink = `https://www.sephora.com/search?keyword=${encodeURIComponent(name)}`
  const priceLabel = price > 0 ? `~$${price.toFixed(0)}` : 'See price'

  return (
    <div className={`card ${isClean ? 'ring-1 ring-sage-200' : ''}`}>

      <div className="flex justify-between items-start gap-4 mb-3">
        <div>
          <h3 className="font-medium text-gray-900 leading-snug">{name}</h3>
          <p className="text-sm text-gray-400 mt-0.5">{brand}</p>
        </div>
        <div className="text-right shrink-0">
          
            href={shopLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sage-600 hover:text-sage-800 text-sm"
          >
            {priceLabel}
          </a>
          {rating > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {rating.toFixed(1)} ({reviewCount > 0 ? reviewCount.toLocaleString() : '0'})
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {isClean ? (
          <span className="text-xs px-2.5 py-1 rounded-full bg-sage-50 text-sage-700 border border-sage-200 font-medium">
            Clean ingredients
          </span>
        ) : (
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
            {flags.length} ingredient concern{flags.length > 1 ? 's' : ''}
          </span>
        )}
        {concerns.map((c) => (
          <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            {c}
          </span>
        ))}
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">Clean score</span>
          <span className="text-xs font-medium text-gray-600">{cleanScore}/100</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              cleanScore >= 80 ? 'bg-sage-500' : cleanScore >= 50 ? 'bg-amber-400' : 'bg-red-400'
            }`}
            style={{ width: `${cleanScore}%` }}
          />
        </div>
      </div>

      <details className="mb-3 group">
        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 list-none flex items-center gap-1">
          <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          How Skinvra scored this
        </summary>
        <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
          {[
            { label: 'Keyword match', value: scoreBreakdown.keywordScore },
            { label: 'Semantic fit',  value: scoreBreakdown.semanticScore },
            { label: 'ROUGE-L',       value: scoreBreakdown.rougeScore },
            { label: 'MSE penalty',   value: -scoreBreakdown.msepenalty },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between bg-gray-50 rounded-lg px-2.5 py-1.5">
              <span className="text-gray-500">{label}</span>
              <span className={`font-medium ${value < 0 ? 'text-red-500' : 'text-gray-700'}`}>
                {value > 0 ? '+' : ''}{value}
              </span>
            </div>
          ))}
        </div>
      </details>

      {flags.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {flags.map((f) => (
            <div key={f.name} className={`text-xs px-3 py-2 rounded-lg border ${SEVERITY_COLORS[f.severity]}`}>
              <span className="font-medium">{f.name}</span> — {f.reason}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        
          href={shopLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-sage-600 hover:text-sage-800 transition-colors"
        >
          Shop on Sephora
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        
          href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(brand + ' ' + name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Compare prices
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  )
}
