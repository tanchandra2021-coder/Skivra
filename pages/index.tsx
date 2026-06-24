
import { useState } from 'react'
import Head from 'next/head'
import SkinTypeStep from '@/components/SkinTypeStep'
import ConcernsStep from '@/components/ConcernsStep'
import BudgetStep from '@/components/BudgetStep'
import ResultsStep from '@/components/ResultsStep'
import type { SkinProfile, ScoredProduct } from '@/lib/types'

const defaultProfile: SkinProfile = {
  skinType: '',
  concerns: [],
  pastProducts: '',
  budget: 'any',
  productType: '',
  extraNotes: '',
}

export default function Home() {
  const [step, setStep] = useState<'landing' | 1 | 2 | 3 | 4>('landing')
  const [profile, setProfile] = useState<SkinProfile>(defaultProfile)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<ScoredProduct[]>([])
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof SkinProfile>(key: K, value: SkinProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }))
  }

  function toggleConcern(concern: string) {
    setProfile((p) => ({
      ...p,
      concerns: p.concerns.includes(concern)
        ? p.concerns.filter((c) => c !== concern)
        : [...p.concerns, concern],
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setProducts([])
    setStep(4)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setProducts(data.products)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  function restart() {
    setProfile(defaultProfile)
    setProducts([])
    setError(null)
    setLoading(false)
    setStep('landing')
  }

  const tickerItems = [
    'Parabens', 'Phthalates', 'Formaldehyde releasers', 'Oxybenzone',
    'Coal tar', 'Triclosan', 'Synthetic fragrance', 'PEGs',
    'BHA & BHT', 'Hydroquinone', 'Ethanolamines', 'Resorcinol',
  ]

  const F = "'DM Sans', sans-serif"
  const S = "'DM Serif Display', serif"

  return (
    <>
      <Head>
        <title>skinvra. — clean beauty, matched to you</title>
        <meta name="description" content="Know what's on your skin. Skinvra screens every ingredient and matches you to products that are actually clean." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #2A1E14; color: #F0EAE0; font-family: ${F}; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ background: '#2A1E14', minHeight: '100vh' }}>

        {/* ── LANDING ── */}
        {step === 'landing' && (
          <>

            {/* HERO */}
            <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

              {/* Full bleed background image */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img
                  src="/images/skin3.webp"
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}
                />
                {/* Editorial scrim — transparent in middle, dark at top and bottom */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(20,12,6,0.75) 0%, rgba(20,12,6,0.05) 30%, rgba(20,12,6,0.05) 55%, rgba(20,12,6,0.92) 100%)',
                }} />
              </div>

              {/* Nav */}
              <nav style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 48px' }}>
                <span style={{ fontFamily: S, fontSize: 20, color: '#F0EAE0', letterSpacing: '0.02em' }}>
                  skinvra<span style={{ color: '#8FA8C0' }}>.</span>
                </span>
                <button onClick={() => setStep(1)} style={{
                  fontFamily: F, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'rgba(240,234,224,0.5)', padding: '9px 20px',
                  border: '0.5px solid rgba(240,234,224,0.2)', borderRadius: 100,
                  background: 'transparent', cursor: 'pointer',
                }}>
                  get my picks
                </button>
              </nav>

              {/* Bottom anchored content */}
              <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', padding: '0 48px 72px' }}>
                <p style={{
                  fontFamily: F, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: 'rgba(240,234,224,0.38)', marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ display: 'block', width: 18, height: '0.5px', background: 'rgba(240,234,224,0.3)' }} />
                  clean beauty · ingredient-screened
                </p>
                <h1 style={{
                  fontFamily: S, fontSize: 'clamp(52px, 7vw, 92px)',
                  fontWeight: 400, lineHeight: 1.0, color: '#F0EAE0', marginBottom: 24,
                }}>
                  know what&apos;s<br />
                  on your{' '}
                  <em style={{ fontStyle: 'italic', color: '#8FA8C0' }}>skin.</em>
                </h1>
                <p style={{ fontFamily: F, fontSize: 13, color: 'rgba(240,234,224,0.38)', lineHeight: 1.9, maxWidth: 380, marginBottom: 36 }}>
                  tell us your concerns and what hasn&apos;t worked. we screen every ingredient
                  and surface what&apos;s actually clean for you.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button onClick={() => setStep(1)} style={{
                    fontFamily: F, display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: '#F0EAE0', color: '#2A1E14',
                    fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '14px 28px', borderRadius: 100, border: 'none', cursor: 'pointer',
                  }}>
                    find my products →
                  </button>
                  <button style={{
                    fontFamily: F, display: 'inline-flex', alignItems: 'center',
                    color: 'rgba(240,234,224,0.28)', fontSize: 11,
                    padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
                    letterSpacing: '0.04em',
                  }}>
                    see how it works ↓
                  </button>
                </div>
              </div>
            </section>

            {/* TICKER */}
            <div style={{ background: '#8FA8C0', padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'inline-flex', animation: 'ticker 28s linear infinite' }}>
                {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
                  <span key={i}>
                    <span style={{ fontFamily: F, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1C120A', opacity: 0.65, paddingRight: 20 }}>{item}</span>
                    <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(28,18,10,0.28)', paddingRight: 20 }}>·</span>
                  </span>
                ))}
              </div>
            </div>

            {/* HOW IT WORKS */}
            <section style={{ padding: '88px 48px', borderBottom: '0.5px solid rgba(240,234,224,0.07)' }}>
              <p style={{ fontFamily: F, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.22)', marginBottom: 56 }}>
                how it works
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 56px' }}>
                {[
                  { n: '01', t: 'your skin profile', d: 'skin type, concerns, and what broke you out before' },
                  { n: '02', t: "what didn't work", d: 'we actively avoid actives that caused reactions' },
                  { n: '03', t: 'budget tier', d: 'drugstore to luxury — no judgment either way' },
                  { n: '04', t: 'clean picks', d: '14 harmful ingredient categories checked instantly' },
                ].map(({ n, t, d }) => (
                  <div key={n}>
                    <div style={{ fontFamily: S, fontSize: 36, fontStyle: 'italic', color: 'rgba(240,234,224,0.05)', lineHeight: 1, marginBottom: 12 }}>{n}</div>
                    <div style={{ fontFamily: S, fontSize: 19, color: '#F0EAE0', marginBottom: 7 }}>{t}</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: 'rgba(240,234,224,0.32)', lineHeight: 1.8 }}>{d}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* IMAGE STRIP */}
            <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 3 }}>
              {/* Left — tall single image */}
              <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
                <img
                  src="/images/skin1.webp"
                  alt="skin closeup"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.2)' }} />
                <span style={{ position: 'absolute', bottom: 18, left: 20, zIndex: 2, fontFamily: F, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.4)' }}>
                  your skin
                </span>
              </div>
              {/* Right — two stacked images */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                  <img
                    src="/images/skin2.webp"
                    alt="glazed skin"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.18)' }} />
                  <span style={{ position: 'absolute', bottom: 14, left: 16, zIndex: 2, fontFamily: F, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.4)' }}>
                    glazed
                  </span>
                </div>
                <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                  <img
                    src="/images/skin4.webp"
                    alt="luminous skin"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.18)' }} />
                  <span style={{ position: 'absolute', bottom: 14, left: 16, zIndex: 2, fontFamily: F, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.4)' }}>
                    luminous
                  </span>
                </div>
              </div>
            </section>

            {/* SAMPLE RESULTS */}
            <section style={{ padding: '80px 48px', borderTop: '0.5px solid rgba(240,234,224,0.07)' }}>
              <p style={{ fontFamily: F, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.22)', marginBottom: 10 }}>sample results</p>
              <h2 style={{ fontFamily: S, fontSize: 32, color: '#F0EAE0', marginBottom: 36 }}>
                picks for <em style={{ fontStyle: 'italic', color: '#8FA8C0' }}>oily,</em> acne-prone skin
              </h2>
              {[
                { icon: '🌿', name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', clean: true, score: 94, price: '~$6' },
                { icon: '☀️', name: 'UV Clear Broad-Spectrum SPF 46', brand: 'EltaMD', clean: true, score: 91, price: '~$41' },
                { icon: '🫧', name: 'Skin Perfecting 2% BHA Liquid', brand: "Paula's Choice", clean: false, score: 72, price: '~$34' },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0', borderBottom: '0.5px solid rgba(240,234,224,0.07)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(240,234,224,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {p.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: S, fontSize: 15, color: '#F0EAE0', marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontFamily: F, fontSize: 10, color: 'rgba(240,234,224,0.28)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.brand}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{
                      fontFamily: F, fontSize: 9, padding: '3px 10px', borderRadius: 100,
                      display: 'block', marginBottom: 4, letterSpacing: '0.06em',
                      color: p.clean ? 'rgba(143,168,192,0.85)' : 'rgba(240,234,224,0.3)',
                      border: `0.5px solid ${p.clean ? 'rgba(143,168,192,0.25)' : 'rgba(240,234,224,0.1)'}`,
                    }}>
                      {p.clean ? `✓ clean · ${p.score}/100` : `⚠ 1 concern`}
                    </span>
                    <span style={{ fontFamily: F, fontSize: 11, color: 'rgba(240,234,224,0.2)' }}>{p.price}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* CLOSE CTA */}
            <section style={{ padding: '80px 48px', borderTop: '0.5px solid rgba(240,234,224,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 style={{ fontFamily: S, fontSize: 42, color: '#F0EAE0', lineHeight: 1.05, marginBottom: 28 }}>
                  skin that works<br />for <em style={{ fontStyle: 'italic', color: '#8FA8C0' }}>you.</em>
                </h2>
                <button onClick={() => setStep(1)} style={{
                  fontFamily: F, display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: '#8FA8C0', color: '#2A1E14',
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '14px 28px', borderRadius: 100, border: 'none', cursor: 'pointer',
                }}>
                  start your profile →
                </button>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: S, fontSize: 52, color: 'rgba(240,234,224,0.06)', lineHeight: 1 }}>2,000+</div>
                <div style={{ fontFamily: F, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.18)', marginTop: 4 }}>products screened</div>
                <div style={{ fontFamily: S, fontSize: 52, color: 'rgba(240,234,224,0.06)', lineHeight: 1, marginTop: 20 }}>14</div>
                <div style={{ fontFamily: F, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.18)', marginTop: 4 }}>harmful categories</div>
              </div>
            </section>

            {/* FOOTER */}
            <footer style={{ padding: '20px 48px', borderTop: '0.5px solid rgba(240,234,224,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: S, fontSize: 14, color: 'rgba(240,234,224,0.22)' }}>skinvra.</span>
              <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(240,234,224,0.14)', letterSpacing: '0.08em' }}>no brand affiliations · ingredient-screened</span>
            </footer>

          </>
        )}

        {/* ── QUIZ ── */}
        {(step === 1 || step === 2 || step === 3 || step === 4) && (
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Quiz nav */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 48px', borderBottom: '0.5px solid rgba(240,234,224,0.07)' }}>
              <button onClick={restart} style={{ fontFamily: S, fontSize: 18, color: '#F0EAE0', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                skinvra<span style={{ color: '#8FA8C0' }}>.</span>
              </button>
              {step !== 4 && (
                <span style={{ fontFamily: F, fontSize: 10, color: 'rgba(240,234,224,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  step {step} of 3
                </span>
              )}
            </nav>

            {/* Progress bar */}
            {step !== 4 && (
              <div style={{ height: '0.5px', background: 'rgba(240,234,224,0.07)' }}>
                <div style={{
                  height: '100%', background: '#8FA8C0',
                  width: `${(Number(step) / 3) * 100}%`,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            )}

            {/* Step content */}
            <div style={{ flex: 1, padding: '56px 48px', maxWidth: 680, width: '100%', margin: '0 auto' }}>
              {step === 1 && (
                <SkinTypeStep
                  value={profile.skinType}
                  onChange={(v) => update('skinType', v)}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <ConcernsStep
                  concerns={profile.concerns}
                  pastProducts={profile.pastProducts}
                  onToggleConcern={toggleConcern}
                  onPastProductsChange={(v) => update('pastProducts', v)}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <BudgetStep
                  budget={profile.budget}
                  productType={profile.productType}
                  extraNotes={profile.extraNotes}
                  onBudgetChange={(v) => update('budget', v)}
                  onProductTypeChange={(v) => update('productType', v)}
                  onExtraNotesChange={(v) => update('extraNotes', v)}
                  onSubmit={handleSubmit}
                  onBack={() => setStep(2)}
                  loading={loading}
                />
              )}
              {step === 4 && (
                loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 20 }}>
                    <div style={{ width: 36, height: 36, border: '0.5px solid rgba(240,234,224,0.1)', borderTopColor: '#8FA8C0', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                    <p style={{ fontFamily: F, fontSize: 12, color: 'rgba(240,234,224,0.35)', letterSpacing: '0.06em' }}>finding your picks</p>
                  </div>
                ) : (
                  <ResultsStep
                    products={products}
                    error={error}
                    skinType={profile.skinType}
                    onRestart={restart}
                  />
                )
              )}
            </div>
          </div>
        )}

      </div>
    </>
  )
}

