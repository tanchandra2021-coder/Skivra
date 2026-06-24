import type { ScoredProduct } from '@/lib/types'
import ProductCard from './ProductCard'

interface Props {
  products: ScoredProduct[]
  error: string | null
  skinType: string
  onRestart: () => void
}

export default function ResultsStep({ products, error, skinType, onRestart }: Props) {
  const cleanCount = products.filter((p) => p.isClean).length
  return (
    <div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.28)', marginBottom: 10 }}>your results</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 34, color: '#F0EAE0', lineHeight: 1.05 }}>
          picks for <em style={{ fontStyle: 'italic', color: '#8FA8C0' }}>{skinType}</em> skin
        </h2>
        {products.length > 0 && (
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(240,234,224,0.25)', paddingBottom: 4 }}>
            {cleanCount} of {products.length} fully clean
          </span>
        )}
      </div>

      {error && (
        <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(240,234,224,0.04)', border: '0.5px solid rgba(240,234,224,0.1)', fontSize: 13, color: 'rgba(240,234,224,0.45)', marginBottom: 28, fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </div>
      )}

      {products.length === 0 && !error && (
        <div style={{ padding: '28px', borderRadius: 14, background: 'rgba(240,234,224,0.03)', border: '0.5px solid rgba(240,234,224,0.07)', fontSize: 13, color: 'rgba(240,234,224,0.35)', marginBottom: 28, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
          no products matched your filters. try selecting &quot;not sure — suggest&quot; for product type or broadening your budget.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 48 }}>
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      <button onClick={onRestart} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        color: 'rgba(240,234,224,0.35)', fontSize: 11, letterSpacing: '0.06em',
        padding: '12px 0', background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        ← start over
      </button>
    </div>
  )
}
