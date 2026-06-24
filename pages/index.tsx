import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
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

  return (
    <>
      <Head>
        <title>skinvra. — clean beauty, matched to you</title>
        <meta name="description" content="Know what's on your skin. Skinvra screens every ingredient and matches you to products that are actually clean." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ background: '#2A1E14', minHeight: '100vh' }}>

        {/* ── LANDING ─────────────────────────────────────── */}
        {step === 'landing' && (
          <>
            {/* HERO — full bleed image, content bottom-anchored */}
            <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

              {/* Background image — skin3 (woman applying product, glazed skin) */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <Image
                  src="/images/skin3.webp"
                  alt=""
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                  priority
                />
                {/* Editorial scrim — transparent in middle, dark top + bottom */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(20,12,6,0.72) 0%, rgba(20,12,6,0.0) 35%, rgba(20,12,6,0.0) 55%, rgba(20,12,6,0.88) 100%)',
                }} />
              </div>

              {/* Nav */}
              <nav style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 48px' }}>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#F0EAE0', letterSpacing: '0.02em' }}>
                  skinvra<span style={{ color: '#8FA8C0' }}>.</span>
                </span>
                <button onClick={() => setStep(1)} style={{
                  fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'rgba(240,234,224,0.5)', padding: '9px 20px',
                  border: '0.5px solid rgba(240,234,224,0.2)', borderRadius: 100,
                  background: 'transparent', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                }}>
                  get my picks
                </button>
              </nav>

              {/* Bottom-anchored headline */}
              <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', padding: '0 48px 72px' }}>
                <p style={{
                  fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: 'rgba(240,234,224,0.38)', marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 12,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  <span style={{ display: 'block', width: 18, height: '0.5px', background: 'rgba(240,234,224,0.3)' }} />
                  clean beauty · ingredient-screened
                </p>
                <h1 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(52px, 7vw, 92px)',
                  fontWeight: 400, lineHeight: 1.0,
                  color: '#F0EAE0', marginBottom: 24,
                }}>
                  know what&apos;s<br />
                  on your{' '}
                  <em style={{ fontStyle: 'italic', color: '#8FA8C0' }}>skin.</em>
                </h1>
                <p style={{
                  fontSize: 13, color: 'rgba(240,234,224,0.38)',
                  lineHeight: 1.9, maxWidth: 380, marginBottom: 36,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  tell us your concerns and what hasn&apos;t worked. we screen every ingredient
                  and surface what&apos;s actually clean for you.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button onClick={() => setStep(1)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: '#F0EAE0', color: '#2A1E14',
                    fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '14px 28px', borderRadius: 100, border: 'none', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    find my products →
                  </button>
                  <button style={{
                    display: 'inline-flex', alignItems: 'center',
                    color: 'rgba(240,234,224,0.28)', fontSize: 11,
                    padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
                    letterSpacing: '0.04em', fontFamily: "'DM Sans', sans-serif",
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
                  <span key={i} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <span style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1C120A', opacity: 0.65, paddingRight: 20 }}>{item}</span>
                    <span style={{ fontSize: 9, color: 'rgba(28,18,10,0.28)', paddingRight: 20 }}>·</span>
                  </span>
                ))}
              </div>
            </div>

            {/* HOW IT WORKS */}
            <section style={{ padding: '88px 48px', borderBottom: '0.5px solid rgba(240,234,224,0.07)' }}>
              <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.22)', marginBottom: 56, fontFamily: "'DM Sans', sans-serif" }}>
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
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, fontStyle: 'italic', color: 'rgba(240,234,224,0.05)', lineHeight: 1, marginBottom: 12 }}>{n}</div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, color: '#F0EAE0', marginBottom: 7 }}>{t}</div>
                    <div style={{ fontSize: 12, color: 'rgba(240,234,224,0.32)', lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>{d}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* IMAGE STRIP — 2 images side by side */}
            <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 3 }}>
              <div style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
                <Image src="/images/skin1.webp" alt="skin closeup" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.22)' }} />
                <span style={{ position: 'absolute', bottom: 18, left: 20, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.4)', fontFamily: "'DM Sans', sans-serif", zIndex: 2 }}>your skin</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                  <Image src="/images/skin2.webp" alt="glazed skin" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.18)' }} />
                  <span style={{ position: 'absolute', bottom: 14, left: 16, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.4)', fontFamily: "'DM Sans', sans-serif", zIndex: 2 }}>glazed</span>
                </div>
                <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                  <Image src="/images/skin4.webp" alt="luminous eye" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.18)' }} />
                  <span style={{ position: 'absolute', bottom: 14, left: 16, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.4)', fontFamily: "'DM Sans', sans-serif", zIndex: 2 }}>luminous</span>
                </div>
              </div>
            </section>

            {/* SAMPLE RESULTS */}
            <section style={{ padding: '80px 48px', borderTop: '0.5px solid rgba(240,234,224,0.07)' }}>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.22)', marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>sample results</p>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: '#F0EAE0', marginBottom: 36 }}>
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
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: '#F0EAE0', marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(240,234,224,0.28)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>{p.brand}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{
                      fontSize: 9, padding: '3px 10px', borderRadius: 100, display: 'block', marginBottom: 4,
                      letterSpacing: '0.06em', fontFamily: "'DM Sans', sans-serif",
                      color: p.clean ? 'rgba(143,168,192,0.85)' : 'rgba(240,234,224,0.28)',
                      border: `0.5px solid ${p.clean ? 'rgba(143,168,192,0.25)' : 'rgba(240,234,224,0.1)'}`,
                    }}>
                      {p.clean ? `✓ clean · ${p.score}/100` : `⚠ 1 concern`}
                    </span>
                    <span style={{ fontSize: 11, color: 'rgba(240,234,224,0.2)', fontFamily: "'DM Sans', sans-serif" }}>{p.price}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* CLOSE CTA */}
            <section style={{ padding: '80px 48px', borderTop: '0.5px solid rgba(240,234,224,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, color: '#F0EAE0', lineHeight: 1.05, marginBottom: 28 }}>
                  skin that works<br />for <em style={{ fontStyle: 'italic', color: '#8FA8C0' }}>you.</em>
                </h2>
                <button onClick={() => setStep(1)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: '#8FA8C0', color: '#2A1E14',
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '14px 28px', borderRadius: 100, border: 'none', cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  start your profile →
                </button>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 52, color: 'rgba(240,234,224,0.06)', lineHeight: 1 }}>2,000+</div>
                <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.18)', marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>products screened</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 52, color: 'rgba(240,234,224,0.06)', lineHeight: 1, marginTop: 20 }}>14</div>
                <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.18)', marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>harmful categories</div>
              </div>
            </section>

            {/* FOOTER */}
            <footer style={{ padding: '20px 48px', borderTop: '0.5px solid rgba(240,234,224,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: 'rgba(240,234,224,0.22)' }}>skinvra.</span>
              <span style={{ fontSize: 9, color: 'rgba(240,234,224,0.14)', letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif" }}>no brand affiliations · ingredient-screened</span>
            </footer>
          </>
        )}

        {/* ── QUIZ STEPS ──────────────────────────────────── */}
        {(step === 1 || step === 2 || step === 3 || step === 4) && (
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Quiz nav */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 48px', borderBottom: '0.5px solid rgba(240,234,224,0.07)' }}>
              <button onClick={restart} style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#F0EAE0', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                skinvra<span style={{ color: '#8FA8C0' }}>.</span>
              </button>
              {step !== 4 && (
                <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>
                  step {step} of 3
                </span>
              )}
            </nav>

            {/* Progress bar */}
            {step !== 4 && (
              <div style={{ height: '0.5px', background: 'rgba(240,234,224,0.07)' }}>
                <div style={{ height: '100%', background: '#8FA8C0', width: `${(Number(step) / 3) * 100}%`, transition: 'width 0.4s ease' }} />
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
                    <div style={{ width: 36, height: 36, border: '0.5px solid rgba(240,234,224,0.15)', borderTopColor: '#8FA8C0', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                    <p style={{ fontSize: 12, color: 'rgba(240,234,224,0.35)', letterSpacing: '0.06em', fontFamily: "'DM Sans', sans-serif" }}>finding your picks</p>
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

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
          @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

      </div>
    </>
  )
}
