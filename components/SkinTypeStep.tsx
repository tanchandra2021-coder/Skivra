interface Props {
  value: string
  onChange: (type: string) => void
  onNext: () => void
}

const TYPES = [
  { id: 'oily',        label: 'oily',        desc: 'shiny, enlarged pores' },
  { id: 'dry',         label: 'dry',          desc: 'tight, flaky, dull' },
  { id: 'combination', label: 'combination',  desc: 'oily T-zone, dry cheeks' },
  { id: 'sensitive',   label: 'sensitive',    desc: 'reacts easily, redness' },
  { id: 'normal',      label: 'normal',       desc: 'balanced, few concerns' },
  { id: 'acne-prone',  label: 'acne-prone',   desc: 'frequent breakouts' },
]

const s = {
  label: { fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(240,234,224,0.28)', marginBottom: 20 },
  h: { fontFamily: "'DM Serif Display', serif", fontSize: 38, fontWeight: 400, color: '#F0EAE0', lineHeight: 1.05, marginBottom: 8 },
  sub: { fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(240,234,224,0.35)', lineHeight: 1.8, marginBottom: 40 },
}

export default function SkinTypeStep({ value, onChange, onNext }: Props) {
  return (
    <div>
      <p style={s.label}>step 1 of 3</p>
      <h2 style={s.h}>what&apos;s your<br /><em style={{ fontStyle: 'italic', color: '#8FA8C0' }}>skin type?</em></h2>
      <p style={s.sub}>select the one that describes your skin most of the time.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 40 }}>
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              padding: '20px 16px', borderRadius: 14, textAlign: 'left', cursor: 'pointer',
              background: value === t.id ? 'rgba(240,234,224,0.07)' : 'rgba(240,234,224,0.03)',
              border: `0.5px solid ${value === t.id ? 'rgba(240,234,224,0.35)' : 'rgba(240,234,224,0.08)'}`,
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: '#F0EAE0', marginBottom: 5 }}>{t.label}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(240,234,224,0.32)', lineHeight: 1.5 }}>{t.desc}</div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!value}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: '#F0EAE0', color: '#2A1E14',
          fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '14px 28px', borderRadius: 100, border: 'none',
          cursor: value ? 'pointer' : 'not-allowed', opacity: value ? 1 : 0.35,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        continue →
      </button>
    </div>
  )
}
