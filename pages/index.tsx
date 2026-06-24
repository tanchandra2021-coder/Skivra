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
        body { background: #2A1E14; color: #F0EAE0; font-family: ${F}; -webkit-font-smoothing: antialiased; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ background: '#2A1E14', minHeight: '100vh' }}>

        {step === 'landing' && (
          <>

            {/* ── HERO ── */}
            <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

              {/* Two images */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%' }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img src="/images/skin3.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '60% center', display: 'block' }} />
                </div>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img src="/images/skin1.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%', display: 'block' }} />
                </div>
              </div>

              {/* Darker scrim for full readability */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(15,9,4,0.72) 0%, rgba(15,9,4,0.52) 25%, rgba(15,9,4,0.52) 70%, rgba(15,9,4,0.95) 100%)',
              }} />

              {/* Center divider */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '0.5px', background: 'rgba(240,234,224,0.1)', zIndex: 5 }} />

              {/* Nav */}
              <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 48px' }}>
                <span style={{ fontFamily: F, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.55)' }}>clean beauty</span>
                <button onClick={() => setStep(1)} style={{ fontFamily: F, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.6)', padding: '9px 20px', border: '0.5px solid rgba(240,234,224,0.28)', borderRadius: 100, background: 'transparent', cursor: 'pointer' }}>
                  get my picks
                </button>
              </nav>

              {/* Center content */}
              <div style={{
                position: 'absolute', inset: 0, zIndex: 15,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '0 32px',
                animation: 'fadeUp 1.2s ease forwards',
              }}>
                {/* Eyebrow */}
                <p style={{ fontFamily: F, fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', marginBottom: 12 }}>
                  ingredient-screened
                </p>

                {/* Logo */}
                <h1 style={{ fontFamily: S, fontSize: 'clamp(64px, 9vw, 118px)', fontWeight: 400, lineHeight: 1, color: '#F0EAE0', textAlign: 'center', letterSpacing: '-0.01em', marginBottom: 10 }}>
                  skinvra<span style={{ color: '#8FA8C0' }}>.</span>
                </h1>

                {/* Tagline */}
                <p style={{ fontFamily: S, fontSize: 'clamp(15px, 1.8vw, 20px)', fontStyle: 'italic', color: 'rgba(240,234,224,0.55)', letterSpacing: '0.01em', marginBottom: 44 }}>
                  know what&apos;s on your skin.
                </p>

                {/* UVPs — bigger, bolder, clearer hierarchy */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 44, width: '100%', maxWidth: 480 }}>

                  {/* UVP 1 — biggest, most important */}
                  <div style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
                    background: 'rgba(15,9,4,0.55)', border: '0.5px solid rgba(240,234,224,0.14)',
                    borderRadius: 14, padding: '16px 24px',
                    backdropFilter: 'blur(12px)',
                  }}>
                    <span style={{ fontFamily: S, fontSize: 28, color: '#8FA8C0', lineHeight: 1, flexShrink: 0 }}>2,000+</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: '#F0EAE0', letterSpacing: '0.02em', lineHeight: 1.4 }}>
                      skincare products scanned &amp; ingredient-checked
                    </span>
                  </div>

                  {/* UVP 2 */}
                  <div style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
                    background: 'rgba(15,9,4,0.55)', border: '0.5px solid rgba(240,234,224,0.14)',
                    borderRadius: 14, padding: '16px 24px',
                    backdropFilter: 'blur(12px)',
                  }}>
                    <span style={{ fontFamily: S, fontSize: 22, color: '#8FA8C0', lineHeight: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: '#F0EAE0', letterSpacing: '0.02em', lineHeight: 1.4 }}>
                      recs based on what&apos;s worked — and what hasn&apos;t — for your skin
                    </span>
                  </div>

                  {/* UVP 3 */}
                  <div style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
                    background: 'rgba(15,9,4,0.55)', border: '0.5px solid rgba(240,234,224,0.14)',
                    borderRadius: 14, padding: '16px 24px',
                    backdropFilter: 'blur(12px)',
                  }}>
                    <span style={{ fontFamily: S, fontSize: 22, color: '#8FA8C0', lineHeight: 1, flexShrink: 0 }}>✦</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: '#F0EAE0', letterSpacing: '0.02em', lineHeight: 1.4 }}>
                      only clean ingredients — no parabens, phthalates, or hormone disruptors
                    </span>
                  </div>

                </div>

                {/* CTA */}
                <button onClick={() => setStep(1)} style={{
                  fontFamily: F, display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: '#F0EAE0', color: '#2A1E14',
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '15px 38px', borderRadius: 100, border: 'none', cursor: 'pointer',
                }}>
                  find my products →
                </button>
              </div>

              {/* Scroll hint */}
              <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
                <div style={{ width: '0.5px', height: 32, background: 'rgba(240,234,224,0.2)' }} />
              </div>
            </section>

            {/* ── TICKER ── */}
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

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: '96px 64px', borderBottom: '0.5px solid rgba(240,234,224,0.07)' }}>
              <p style={{ fontFamily: F, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.22)', marginBottom: 64 }}>how it works</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px 72px' }}>
                {[
                  { n: '01', t: 'your skin profile', d: 'skin type, concerns, and what broke you out before' },
                  { n: '02', t: "what didn't work", d: 'we actively avoid actives that caused reactions' },
                  { n: '03', t: 'budget tier', d: 'drugstore to luxury — no judgment either way' },
                  { n: '04', t: 'clean picks', d: '14 harmful ingredient categories checked instantly' },
                ].map(({ n, t, d }) => (
                  <div key={n}>
                    <div style={{ fontFamily: S, fontSize: 40, fontStyle: 'italic', color: 'rgba(240,234,224,0.04)', lineHeight: 1, marginBottom: 14 }}>{n}</div>
                    <div style={{ fontFamily: S, fontSize: 20, color: '#F0EAE0', marginBottom: 8 }}>{t}</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: 'rgba(240,234,224,0.35)', lineHeight: 1.85 }}>{d}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── IMAGE DIVIDER ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 480 }}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img src="/images/skin2.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.25)' }} />
                <span style={{ position: 'absolute', bottom: 22, left: 28, fontFamily: F, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', zIndex: 2 }}>glazed</span>
              </div>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img src="/images/skin4.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.22)' }} />
                <span style={{ position: 'absolute', bottom: 22, right: 28, fontFamily: F, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', zIndex: 2 }}>luminous</span>
              </div>
            </section>

            {/* ── SAMPLE RESULTS ── */}
            <section style={{ padding: '88px 64px', borderTop: '0.5px solid rgba(240,234,224,0.07)' }}>
              <p style={{ fontFamily: F, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.22)', marginBottom: 12 }}>sample results</p>
              <h2 style={{ fontFamily: S, fontSize: 36, color: '#F0EAE0', marginBottom: 48, lineHeight: 1.1 }}>
                picks for <em style={{ fontStyle: 'italic', color: '#8FA8C0' }}>oily,</em> acne-prone skin
              </h2>
              {[
                { icon: '🌿', name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', clean: true, score: 94, price: '~$6' },
                { icon: '☀️', name: 'UV Clear Broad-Spectrum SPF 46', brand: 'EltaMD', clean: true, score: 91, price: '~$41' },
                { icon: '🫧', name: 'Skin Perfecting 2% BHA Liquid', brand: "Paula's Choice", clean: false, score: 72, price: '~$34' },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 0', borderBottom: '0.5px solid rgba(240,234,224,0.07)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(240,234,224,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{p.icon}</div>
                  <div>
                    <div style={{ fontFamily: S, fontSize: 16, color: '#F0EAE0', marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontFamily: F, fontSize: 10, color: 'rgba(240,234,224,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.brand}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontFamily: F, fontSize: 9, padding: '4px 12px', borderRadius: 100, display: 'block', marginBottom: 5, letterSpacing: '0.06em', color: p.clean ? 'rgba(143,168,192,0.9)' : 'rgba(240,234,224,0.35)', border: `0.5px solid ${p.clean ? 'rgba(143,168,192,0.3)' : 'rgba(240,234,224,0.12)'}` }}>
                      {p.clean ? `✓ clean · ${p.score}/100` : `⚠ 1 concern`}
                    </span>
                    <span style={{ fontFamily: F, fontSize: 11, color: 'rgba(240,234,224,0.25)' }}>{p.price}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* ── CLOSE CTA ── */}
            <section style={{ padding: '88px 64px', borderTop: '0.5px solid rgba(240,234,224,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 style={{ fontFamily: S, fontSize: 48, color: '#F0EAE0', lineHeight: 1.0, marginBottom: 32 }}>
                  skin that works<br />for <em style={{ fontStyle: 'italic', color: '#8FA8C0' }}>you.</em>
                </h2>
                <button onClick={() => setStep(1)} style={{ fontFamily: F, display: 'inline-flex', alignItems: 'center', gap: 10, background: '#8FA8C0', color: '#2A1E14', fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
                  start your profile →
                </button>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: S, fontSize: 60, color: 'rgba(240,234,224,0.05)', lineHeight: 1 }}>2,000+</div>
                <div style={{ fontFamily: F, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.18)', marginTop: 4 }}>products screened</div>
                <div style={{ fontFamily: S, fontSize: 60, color: 'rgba(240,234,224,0.05)', lineHeight: 1, marginTop: 24 }}>14</div>
                <div style={{ fontFamily: F, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.18)', marginTop: 4 }}>harmful categories</div>
              </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ padding: '22px 64px', borderTop: '0.5px solid rgba(240,234,224,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: S, fontSize: 15, color: 'rgba(240,234,224,0.2)' }}>skinvra.</span>
              <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(240,234,224,0.12)', letterSpacing: '0.08em' }}>no brand affiliations · ingredient-screened</span>
            </footer>

          </>
        )}

        {/* ── QUIZ ── */}
        {(step === 1 || step === 2 || step === 3 || step === 4) && (
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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

            {step !== 4 && (
              <div style={{ height: '0.5px', background: 'rgba(240,234,224,0.07)' }}>
                <div style={{ height: '100%', background: '#8FA8C0', width: `${(Number(step) / 3) * 100}%`, transition: 'width 0.5s ease' }} />
              </div>
            )}

            <div style={{ flex: 1, padding: '64px 48px', maxWidth: 700, width: '100%', margin: '0 auto' }}>
              {step === 1 && <SkinTypeStep value={profile.skinType} onChange={(v) => update('skinType', v)} onNext={() => setStep(2)} />}
              {step === 2 && <ConcernsStep concerns={profile.concerns} pastProducts={profile.pastProducts} onToggleConcern={toggleConcern} onPastProductsChange={(v) => update('pastProducts', v)} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
              {step === 3 && <BudgetStep budget={profile.budget} productType={profile.productType} extraNotes={profile.extraNotes} onBudgetChange={(v) => update('budget', v)} onProductTypeChange={(v) => update('productType', v)} onExtraNotesChange={(v) => update('extraNotes', v)} onSubmit={handleSubmit} onBack={() => setStep(2)} loading={loading} />}
              {step === 4 && (
                loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 20 }}>
                    <div style={{ width: 36, height: 36, border: '0.5px solid rgba(240,234,224,0.1)', borderTopColor: '#8FA8C0', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                    <p style={{ fontFamily: F, fontSize: 12, color: 'rgba(240,234,224,0.35)', letterSpacing: '0.06em' }}>finding your picks</p>
                  </div>
                ) : (
                  <ResultsStep products={products} error={error} skinType={profile.skinType} onRestart={restart} />
                )
              )}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
