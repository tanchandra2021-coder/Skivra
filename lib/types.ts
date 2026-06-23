export interface SkinProfile {
  skinType: string
  concerns: string[]
  pastProducts: string
  budget: string
  productType: string
  extraNotes: string
}

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  productType: string
  skinTypes: string[]
  concerns: string[]
  ingredients: string
  description: string
  link: string
  rating: number
  reviewCount: number
}

export interface ScoredProduct extends Product {
  flags: IngredientFlag[]
  isClean: boolean
  cleanScore: number
  relevanceScore: number
  finalScore: number
  scoreBreakdown: ScoreBreakdown
}

export interface IngredientFlag {
  name: string
  category: string
  reason: string
  severity: 'high' | 'medium' | 'low'
}

export interface ScoreBreakdown {
  keywordScore: number
  semanticScore: number
  rougeScore: number
  msepenalty: number
  cleanScore: number
}
