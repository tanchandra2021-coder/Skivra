import type { SkinProfile, Product, ScoredProduct } from './types'
import { scanIngredients, computeCleanScore } from './ingredients'

const CONCERN_KEYWORDS: Record<string, Record<string, number>> = {
  'acne / breakouts': {
    salicylic: 10, bha: 9, niacinamide: 8, benzoyl: 9, zinc: 7,
    sulfur: 8, tea: 6, retinol: 6, noncomedogenic: 9, 'oil-free': 8,
    pore: 7, clarifying: 8, acne: 10, breakout: 9, antibacterial: 7,
  },
  'dark spots / hyperpigmentation': {
    vitamin: 8, 'vitamin c': 10, ascorbic: 9, kojic: 9, niacinamide: 8,
    alpha: 7, arbutin: 10, tranexamic: 9, azelaic: 8, brightening: 9,
    dark: 7, spot: 7, pigment: 9, even: 6, tone: 6, fade: 8,
  },
  'fine lines / wrinkles': {
    retinol: 10, retinoid: 10, peptide: 9, collagen: 8, hyaluronic: 8,
    firming: 8, 'anti-aging': 9, wrinkle: 9, line: 7, elastin: 8,
    ceramide: 7, plump: 7, renewal: 7, aha: 7, glycolic: 7,
  },
  'redness / rosacea': {
    centella: 10, cica: 10, azelaic: 9, niacinamide: 8, green: 7,
    calming: 9, soothing: 9, sensitive: 8, redness: 10, rosacea: 10,
    aloe: 7, chamomile: 7, 'fragrance-free': 9, gentle: 8, 'anti-inflammatory': 9,
  },
  'dullness / uneven texture': {
    aha: 9, glycolic: 9, lactic: 8, exfoliant: 9, vitamin: 7,
    'vitamin c': 9, brightening: 9, glow: 8, radiance: 8, resurfacing: 9,
    texture: 8, smooth: 7, renewal: 8, peel: 7, luminous: 7,
  },
  'large pores': {
    niacinamide: 10, salicylic: 9, bha: 8, retinol: 7, clay: 8,
    pore: 10, minimizing: 9, tightening: 8, astringent: 7, zinc: 7,
    'oil-free': 8, mattifying: 8, refine: 8,
  },
  'dryness / dehydration': {
    hyaluronic: 10, ceramide: 10, glycerin: 9, squalane: 9, shea: 8,
    moisture: 9, hydrating: 10, moisturizing: 9, nourishing: 8, barrier: 9,
    dry: 8, dehydrated: 8, rich: 7, emollient: 8, occlusiv: 7,
  },
  'dark circles': {
    caffeine: 10, vitamin: 7, 'vitamin k': 9, retinol: 7, peptide: 8,
    eye: 9, dark: 8, circle: 9, brightening: 8, depuff: 9,
    hyaluronic: 7, niacinamide: 7, arnica: 8,
  },
  'sun damage': {
    vitamin: 7, 'vitamin c': 9, niacinamide: 8, retinol: 8, aha: 7,
    brightening: 8, spf: 9, sunscreen: 8, antioxidant: 9, resveratrol: 7,
    dark: 6, spot: 7, repair: 8, renewal: 8,
  },
  'uneven skin tone': {
    niacinamide: 9, vitamin: 7, 'vitamin c': 10, kojic: 8, azelaic: 8,
    brightening: 9, even: 9, tone: 8, tranexamic: 9, arbutin: 9,
    fade: 7, pigment: 7, luminous: 7, glow: 7,
  },
}

const SKIN_TYPE_KEYWORDS: Record<string, Record<string, number>> = {
  oily:         { 'oil-free': 10, mattifying: 9, lightweight: 8, gel: 8, balancing: 8, noncomedogenic: 9, salicylic: 7, niacinamide: 7 },
  dry:          { rich: 9, cream: 8, hydrating: 9, nourishing: 8, ceramide: 9, shea: 8, squalane: 8, emollient: 9 },
  combination:  { balancing: 9, lightweight: 8, gel: 7, 'oil-free': 7, hydrating: 7, niacinamide: 8 },
  sensitive:    { 'fragrance-free': 10, gentle: 9, calming: 9, soothing: 9, hypoallergenic: 9, centella: 8, aloe: 7, minimal: 7 },
  normal:       { balancing: 7, hydrating: 7, antioxidant: 7, lightweight: 7 },
  'acne-prone': { noncomedogenic: 10, 'oil-free': 9, salicylic: 9, benzoyl: 8, niacinamide: 8, gentle: 7, bha: 9 },
}

function keywordScore(profile: SkinProfile, product: Product): number {
  const corpus = (product.description + ' ' + product.ingredients + ' ' + product.concerns.join(' ')).toLowerCase()
  let score = 0
  let maxPossible = 0

  for (const concern of profile.concerns) {
    const dict = CONCERN_KEYWORDS[concern.toLowerCase()] ?? {}
    for (const [term, weight] of Object.entries(dict)) {
      maxPossible += weight
      if (corpus.includes(term)) score += weight
    }
  }

  const skinDict = SKIN_TYPE_KEYWORDS[profile.skinType] ?? {}
  for (const [term, weight] of Object.entries(skinDict)) {
    maxPossible += weight
    if (corpus.includes(term)) score += weight
  }

  return maxPossible > 0 ? (score / maxPossible) * 100 : 50
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
}

function buildTFIDF(docs: string[]): Map<string, number>[] {
  const tokenizedDocs = docs.map(tokenize)
  const df: Map<string, number> = new Map()

  for (const tokens of tokenizedDocs) {
    for (const t of Array.from(new Set(tokens))) {
      df.set(t, (df.get(t) ?? 0) + 1)
    }
  }

  return tokenizedDocs.map(tokens => {
    const tf: Map<string, number> = new Map()
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1)
    const tfidf: Map<string, number> = new Map()
    for (const [t, count] of Array.from(tf.entries())) {
      const idf = Math.log((docs.length + 1) / ((df.get(t) ?? 0) + 1))
      tfidf.set(t, (count / tokens.length) * idf)
    }
    return tfidf
  })
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, normA = 0, normB = 0
  for (const [t, v] of Array.from(a.entries())) {
    dot += v * (b.get(t) ?? 0)
    normA += v * v
  }
  for (const [, v] of Array.from(b.entries())) normB += v * v
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

function semanticScore(profile: SkinProfile, products: Product[]): number[] {
  const query = [profile.skinType, profile.concerns.join(' '), profile.extraNotes].join(' ')
  const docs = [query, ...products.map(p => p.description + ' ' + p.concerns.join(' '))]
  const vectors = buildTFIDF(docs)
  const queryVec = vectors[0]
  return products.map((_, i) => Math.min(100, cosineSimilarity(queryVec, vectors[i + 1]) * 400))
}

function lcs(a: string[], b: string[]): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1])
    }
  }
  return dp[a.length][b.length]
}

function rougeL(profile: SkinProfile, product: Product): number {
  const ref = tokenize(profile.concerns.join(' ') + ' ' + profile.skinType)
  const hyp = tokenize(product.description + ' ' + product.concerns.join(' '))
  if (ref.length === 0 || hyp.length === 0) return 0
  const lcsLen = lcs(ref, hyp)
  const precision = lcsLen / hyp.length
  const recall = lcsLen / ref.length
  if (precision + recall === 0) return 0
  return (2 * precision * recall) / (precision + recall) * 100
}

function extractFailedActives(pastProductsText: string): string[] {
  const failSignals = [
    'broke me out', 'breakout', 'irritat', 'burned', 'burn', 'too harsh',
    'peeling', 'peel', 'allergic', 'reaction', 'rash', 'stung', 'sting',
    "didn't work", 'did not work', 'no results', 'worse', 'bad reaction', 'clogged',
  ]
  const knownActives = [
    'niacinamide', 'retinol', 'retinoid', 'glycolic', 'lactic', 'salicylic',
    'aha', 'bha', 'vitamin c', 'ascorbic', 'benzoyl', 'kojic', 'azelaic',
    'hyaluronic', 'fragrance', 'parfum', 'alcohol', 'essential oil', 'tea tree',
    'rose hip', 'argan', 'coconut', 'mineral oil', 'lanolin', 'dimethicone',
    'sulfate', 'sls', 'sles',
  ]
  const lines = pastProductsText.toLowerCase().split(/[.,\n]+/)
  const failed: string[] = []
  for (const line of lines) {
    if (failSignals.some(sig => line.includes(sig))) {
      for (const active of knownActives) {
        if (line.includes(active)) failed.push(active)
      }
    }
  }
  return Array.from(new Set(failed))
}

function msePenalty(failedActives: string[], product: Product): number {
  if (failedActives.length === 0) return 0
  const corpus = (product.ingredients + ' ' + product.description).toLowerCase()
  const productVector: number[] = failedActives.map(a => corpus.includes(a) ? 1 : 0)
  const mse = productVector.reduce((sum: number, val: number) => sum + Math.pow(val - 1, 2), 0) / failedActives.length
  return (1 - mse) * 50
}

function inBudget(product: Product, budget: string): boolean {
  if (budget === 'any' || !budget) return true
  const p = product.price
  if (budget === 'drugstore') return p <= 25
  if (budget === 'mid') return p > 10 && p <= 60
  if (budget === 'premium') return p > 35 && p <= 120
  if (budget === 'luxury') return p > 80
  return true
}

export function scoreProducts(profile: SkinProfile, catalog: Product[]): ScoredProduct[] {
  const filtered = catalog.filter(p => {
    const typeMatch = !profile.productType ||
      profile.productType === 'Not sure — suggest' ||
      p.productType.toLowerCase() === profile.productType.toLowerCase()
    const budgetMatch = inBudget(p, profile.budget)
    const skinMatch = !p.skinTypes || p.skinTypes.length === 0 ||
      p.skinTypes.includes('all') || p.skinTypes.includes(profile.skinType)
    return typeMatch && budgetMatch && skinMatch
  })

  if (filtered.length === 0) return []

  const failedActives = extractFailedActives(profile.pastProducts || '')
  const semanticScores = semanticScore(profile, filtered)

  return filtered
    .map((product, i) => {
      const kw    = keywordScore(profile, product)
      const sem   = semanticScores[i]
      const rouge = rougeL(profile, product)
      const mse   = msePenalty(failedActives, product)
      const clean = computeCleanScore(product.ingredients)
      const flags = scanIngredients(product.ingredients)

      const relevance = (kw * 0.30) + (sem * 0.25) + (rouge * 0.20) - (mse * 0.15)
      const ratingBonus = ((product.rating / 5) * 100) * 0.10
      const finalScore = Math.max(0, relevance + (clean * 0.15) + ratingBonus)

      return {
        ...product,
        flags,
        isClean: flags.length === 0,
        cleanScore: clean,
        relevanceScore: relevance,
        finalScore,
        scoreBreakdown: {
          keywordScore:  Math.round(kw),
          semanticScore: Math.round(sem),
          rougeScore:    Math.round(rouge),
          msepenalty:    Math.round(mse),
          cleanScore:    Math.round(clean),
        },
      }
    })
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 5)
}
