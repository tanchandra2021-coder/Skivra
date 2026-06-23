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
  oily:        { 'oil-free': 10, mattifying: 9, lightweight: 8, gel: 8, balancing: 8, noncomedogenic: 9, salicylic: 7, niacinamide: 7 },
  dry:         { rich: 9, cream: 8, hydrating: 9, nourishing: 8, ceramide: 9, shea: 8, squalane: 8, emollient: 9 },
  combination: { balancing: 9, lightweight: 8, gel: 7, 'oil-free': 7, hydrating: 7, niacinamide: 8 },
  sensitive:   { 'fragrance-free': 10, gentle: 9, calming: 9, soothing: 9, hypoallergenic: 9, centella: 8, aloe: 7, minimal: 7 },
  normal:      { balancing: 7, hydrating: 7, antioxidant: 7, lightweight: 7 },
  'acne-prone':{ noncomedogenic: 10, 'oil-free': 9, salicylic: 9, benzoyl: 8, niacinamide: 8, gentle: 7, bha: 9 },
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
    for (const t of new Set(tokens)) {
      df.set(t, (df.get(t) ?? 0) + 1)
    }
  }

  return tokenizedDocs.map(tokens => {
    const tf: Map<string, number> = new Map()
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1)
    const tfidf: Map<string, number> = new Map()
    for (const [t, count] of tf) {
      const idf = Math.log((docs.length + 1) /
