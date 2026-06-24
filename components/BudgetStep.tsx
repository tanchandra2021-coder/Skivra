interface Props {
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

const TIERS = [
  { id: 'drugstore', label: 'drugstore',   desc: 'CeraVe, Neutrogena, The Ordinary',        range: 'under $25' },
  { id: 'mid',       label: 'mid-range',   desc: "Paula's Choice, COSRX, Glow Recipe",       range: '$15 – $60' },
  { id: 'premium',   label: 'premium',     desc: 'Tatcha, Drunk Elephant, Sunday Riley',      range: '$40 – $120' },
  { id: 'luxury',    label: 'luxury',      desc: 'La Mer, Augustinus Bader, SK-II',           range: '$80+' },
  { id: 'any',       label: 'no preference', desc: 'show me everything',                      range: '' },
]

const TYPES = ['Moisturizer','Serum','Cleanser','Sunscreen','Toner','Eye cream','Exfoliant','Face oil','Mask','Not sure — suggest']

export default function BudgetStep({ budget, productType, extraNotes, onBudgetChange, onProductTypeChange, onExtraNotesChange, onSubmit, onBack, loading }: Props) {
  return (
    <div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.28)', marginBottom: 20 }}>step 3 of 3</p>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, color: '#F0EAE0', lineHeight: 1.05, marginBottom: 8 }}>
        budget <em style={{ fontStyle: 'italic', color: '#8FA8C0' }}>&amp; preferences.</em>
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(240,234,224,0.35)', lineHeight: 1.8, marginBottom: 36 }}>no judgment here.</p>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(240,234,224,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>price range</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TIERS.map((t) => (
            <button key={t.id} onClick={() => onBudgetChange(t.id)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', borderRadius: 14, textAlign: 'left', cursor: 'pointer',
              background: budget === t.id ? 'rgba(240,234,224,0.07)' : 'rgba(240,234,224,0.02)',
              border: `0.5px solid ${budget === t.id ? 'rgba(240,234,224,0.3)' : 'rgba(240,234,224,0.07)'}`,
              transition: 'all 0.15s',
            }}>
              <div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#F0EAE0', marginBottom: 3 }}>{t.label}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(240,234,224,0.3)' }}>{t.desc}</div>
              </div>
              {t.range && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(240,234,224,0.22)', flexShrink: 0 }}>{t.range}</div>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(240,234,224,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>product type</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TYPES.map((t) => (
            <button key={t} onClick={() => onProductTypeChange(t)} style={{
              padding: '9px 18px', borderRadius: 100, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              background: productType === t ? 'rgba(240,234,224,0.07)' : 'transparent',
              border: `0.5px solid ${productType === t ? 'rgba(240,234,224,0.38)' : 'rgba(240,234,224,0.1)'}`,
              color: productType === t ? '#F0EAE0' : 'rgba(240,234,224,0.38)',
              transition: 'all 0.15s',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(240,234,224,0.4)', display: 'block', marginBottom: 10 }}>
          anything else? <span style={{ color: 'rgba(240,234,224,0.22)' }}>(optional)</span>
        </label>
        <textarea rows={3} value={extraNotes} onChange={(e) => onExtraNotesChange(e.target.value)}
          placeholder="fragrance-free, vegan, cruelty-free, no silicones..."
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: 'rgba(240,234,224,0.04)', border: '0.5px solid rgba(240,234,224,0.1)',
            color: '#F0EAE0', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.7, resize: 'none', outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} disabled={loading} style={{
          padding: '14px 22px', borderRadius: 100, border: '0.5px solid rgba(240,234,224,0.12)',
          color: 'rgba(240,234,224,0.35)', background: 'transparent', cursor: 'pointer',
          fontSize: 11, fontFamily: "'DM Sans', sans-serif",
        }}>← back</button>
        <button onClick={onSubmit} disabled={loading || !productType || !budget} style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: '#F0EAE0', color: '#2A1E14',
          fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '14px 28px', borderRadius: 100, border: 'none',
          cursor: (loading || !productType || !budget) ? 'not-allowed' : 'pointer',
          opacity: (loading || !productType || !budget) ? 0.35 : 1,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {loading ? 'finding your picks...' : 'find my products →'}
        </button>
      </div>
    </div>
  )
}
