import type { ScoredProduct } from '@/lib/types'

interface Props { product: ScoredProduct }

const SEVERITY: Record<string, { color: string; border: string }> = {
  high:   { color: 'rgba(220,100,80,0.75)',  border: 'rgba(220,100,80,0.2)' },
  medium: { color: 'rgba(200,160,80,0.75)',  border: 'rgba(200,160,80,0.2)' },
  low:    { color: 'rgba(240,234,224,0.35)', border: 'rgba(240,234,224,0.1)' },
}

export default function ProductCard({ product }: Props) {
  const { name, brand, price, concerns, flags, isClean, cleanScore, link, rating, reviewCount, scoreBreakdown } = product
  const shopLink = `https://www.sephora.com/search?keyword=${encodeURIComponent(name)}`
  const priceLabel = price > 0 ? `~$${price.toFixed(0)}` : 'see price'

  return (
    <div style={{ padding: '22px 0', borderBottom: '0.5px solid rgba(240,234,224,0.07)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#F0EAE0', marginBottom: 3 }}>{name}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(240,234,224,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{brand}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <a href={shopLink} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#8FA8C0', textDecoration: 'none', display: 'block', marginBottom: 3 }}>
            {priceLabel} →
          </a>
          {rating > 0 && (
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(240,234,224,0.2)' }}>
              ★ {rating.toFixed(1)} {reviewCount > 0 ? `(${reviewCount.toLocaleString()})` : ''}
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 9, padding: '3px 10px', borderRadius: 100, letterSpacing: '0.06em',
          color: isClean ? 'rgba(143,168,192,0.85)' : 'rgba(200,160,80,0.75)',
          border: `0.5px solid ${isClean ? 'rgba(143,168,192,0.25)' : 'rgba(200,160,80,0.2)'}`,
        }}>
          {isClean ? `✓ clean · ${cleanScore}/100` : `⚠ ${flags.length} concern${flags.length > 1 ? 's' : ''}`}
        </span>
        {concerns.slice(0, 2).map((c) => (
          <span key={c} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, padding: '3px 10px', borderRadius: 100, color: 'rgba(240,234,224,0.3)', border: '0.5px solid rgba(240,234,224,0.08)', letterSpacing: '0.04em' }}>{c}</span>
        ))}
      </div>

      {/* Clean score bar */}
      <div style={{ marginBottom: flags.length > 0 ? 12 : 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: 'rgba(240,234,224,0.22)', letterSpacing: '0.06em' }}>clean score</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: 'rgba(240,234,224,0.3)' }}>{cleanScore}/100</span>
        </div>
        <div style={{ height: 1, background: 'rgba(240,234,224,0.06)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 1, width: `${cleanScore}%`, background: cleanScore >= 80 ? '#8FA8C0' : cleanScore >= 50 ? 'rgba(200,160,80,0.6)' : 'rgba(220,100,80,0.6)' }} />
        </div>
      </div>

      {/* Ingredient flags */}
      {flags.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
          {flags.map((f) => (
            <div key={f.name} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, padding: '8px 12px', borderRadius: 8, color: SEVERITY[f.severity].color, border: `0.5px solid ${SEVERITY[f.severity].border}`, lineHeight: 1.5 }}>
              <strong style={{ fontWeight: 500 }}>{f.name}</strong> — {f.reason}
            </div>
          ))}
        </div>
      )}

      {/* Score breakdown */}
      <details style={{ marginTop: 14 }}>
        <summary style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(240,234,224,0.22)', cursor: 'pointer', letterSpacing: '0.06em', listStyle: 'none' }}>
          how skinvra scored this ↓
        </summary>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
          {[
            { label: 'keyword match', value: scoreBreakdown.keywordScore },
            { label: 'semantic fit',  value: scoreBreakdown.semanticScore },
            { label: 'rouge-l',       value: scoreBreakdown.rougeScore },
            { label: 'mse penalty',   value: -scoreBreakdown.msepenalty },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', borderRadius: 8, background: 'rgba(240,234,224,0.03)', border: '0.5px solid rgba(240,234,224,0.06)' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(240,234,224,0.25)' }}>{label}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: value < 0 ? 'rgba(220,100,80,0.7)' : 'rgba(240,234,224,0.45)', fontWeight: 500 }}>
                {value > 0 ? '+' : ''}{value}
              </span>
            </div>
          ))}
        </div>
      </details>

      {/* Links */}
      <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
        <a href={shopLink} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#8FA8C0', textDecoration: 'none', letterSpacing: '0.04em' }}>
          shop on sephora →
        </a>
        <a href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(brand + ' ' + name)}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(240,234,224,0.22)', textDecoration: 'none', letterSpacing: '0.04em' }}>
          compare prices
        </a>
      </div>
    </div>
  )
}
