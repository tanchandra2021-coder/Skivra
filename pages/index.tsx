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
  budget: '$25–$50',
  productType: '',
  extraNotes: '',
}

export default function Home() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<SkinProfile>(defaultProfile)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<ScoredProduct[]>([])
  const [error, setError] = useState<string | null>(null)

  const progress = (step / 4) * 100

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
    setStep(1)
  }

  return (
    <>
      <Head>
        <title>Skinvra — Clean Beauty, Matched to You</title>
        <meta name="description" content="Skinvra finds clean, safe skincare products matched to your skin type, concerns, and what's worked for you before." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-ivory-100">
        {/* Header */}
        <header className="border-b border-ivory-300 bg-ivory-50">
          <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl tracking-tight text-gray-900">Skinvra</span>
              <span className="text-xs text-sage-600 tracking-wide">clean beauty, matched to you</span>
            </div>
            <span className="text-xs text-gray-400 hidden sm:block">ingredient-screened · personalized</span>
          </div>
        </header>

        {/* Progress bar */}
        <div className="h-0.5 bg-ivory-300">
          <div
            className="h-full bg-sage-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <main className="max-w-2xl mx-auto px-6 py-10">
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
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-10 h-10 border-2 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Skinvra is analyzing your profile...</p>
                <p className="text-xs text-gray-400">Matching ingredients to your skin</p>
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
        </main>
      </div>
    </>
  )
}
