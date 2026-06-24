interface Props {
  concerns: string[]
  pastProducts: string
  onToggleConcern: (c: string) => void
  onPastProductsChange: (v: string) => void
  onNext: () => void
  onBack: () => void
}

const CONCERNS = [
  'Acne / breakouts', 'Dark spots / hyperpigmentation', 'Fine lines / wrinkles',
  'Redness / rosacea', 'Dullness / uneven texture', 'Large pores',
  'Dryness / dehydration', 'Dark circles', 'Sun damage', 'Uneven skin tone',
]

const btn = (active: boolean) => ({
  padding: '9px 18px', borderRadius: 100, cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif", fontSize: 12,
  background: active ? 'rgba(240,234,224,0.07)' : 'transparent',
  border: `0.5px solid ${active ? 'rgba(240,234,224,0.38)' : 'rgba(240,234,224,0.1)'}`,
  color: active ? '#F0EAE0' : 'rgba(240,234,224,0.38)',
  transition: 'all 0.15s',
})

export default function ConcernsStep({ concerns, pastProducts, onToggleConcern, onPastProductsChange, onNext, onBack }: Props) {
  return (
    <div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.28)', marginBottom: 20 }}>step 2 of 3</p>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, color: '#F0EAE0', lineHeight: 1.05, marginBottom: 8 }}>
        your <em style={{ fontStyle: 'italic', color: '#8FA8C0' }}>concerns.</em>
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(240,234,224,0.35)', lineHeight: 1.8, marginBottom: 32 }}>pick everything that applies.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
        {CONCERNS.map((c) => (
          <button key={c} onClick={() => onToggleConcern(c)} style={btn(concerns.includes(c))}>{c}</button>
        ))}
      </div>

      <div style={{ marginBottom: 40 }}>
        <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(240,234,224,0.45)', display: 'block', marginBottom: 6 }}>
          products you&apos;ve tried — what worked and what didn&apos;t
        </label>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(240,234,224,0.22)', marginBottom: 10, lineHeight: 1.6 }}>
          be specific about reactions — we&apos;ll actively avoid what caused issues.
        </p>
        <textarea
          rows={4}
          value={pastProducts}
          onChange={(e) => onPastProductsChange(e.target.value)}
          placeholder="e.g. CeraVe moisturizer worked great. The Ordinary niacinamide broke me out. Paula's Choice BHA was too harsh..."
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: 'rgba(240,234,224,0.04)', border: '0.5px solid rgba(240,234,224,0.1)',
            color: '#F0EAE0', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.7, resize: 'none', outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{
          padding: '14px 22px', borderRadius: 100, border: '0.5px solid rgba(240,234,224,0.12)',
          color: 'rgba(240,234,224,0.35)', background: 'transparent', cursor: 'pointer',
          fontSize: 11, fontFamily: "'DM Sans', sans-serif",
        }}>← back</button>
        <button onClick={onNext} style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: '#F0EAE0', color: '#2A1E14',
          fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '14px 28px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}>continue →</button>
      </div>
    </div>
  )
}
