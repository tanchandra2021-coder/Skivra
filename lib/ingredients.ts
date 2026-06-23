import type { IngredientFlag } from './types'

export interface HarmfulIngredient {
  name: string
  terms: string[]
  category: string
  reason: string
  severity: 'high' | 'medium' | 'low'
  weight: number
}

export const HARMFUL_INGREDIENTS: HarmfulIngredient[] = [
  { name: 'Parabens', terms: ['methylparaben','ethylparaben','propylparaben','butylparaben','isobutylparaben'], category: 'endocrine-disruptor', reason: 'Mimic estrogen; linked to breast cancer tissue and reproductive harm', severity: 'high', weight: 30 },
  { name: 'Phthalates', terms: ['phthalate','dibutyl phthalate','diethyl phthalate','dimethyl phthalate'], category: 'endocrine-disruptor', reason: 'Disrupt hormone signaling; linked to developmental and reproductive toxicity', severity: 'high', weight: 30 },
  { name: 'Formaldehyde & releasers', terms: ['formaldehyde','dmdm hydantoin','imidazolidinyl urea','diazolidinyl urea','quaternium-15','sodium hydroxymethylglycinate','bronopol'], category: 'carcinogen', reason: 'Known carcinogen (IARC Group 1); releases toxic formaldehyde gas over time', severity: 'high', weight: 30 },
  { name: 'Oxybenzone', terms: ['oxybenzone','benzophenone-3','benzophenone'], category: 'endocrine-disruptor', reason: 'Absorbs through skin; possible hormone disruptor', severity: 'high', weight: 25 },
  { name: 'Coal tar dyes', terms: ['p-phenylenediamine','coal tar','aminophenol','fd&c','d&c red','d&c blue'], category: 'carcinogen', reason: 'Derived from petroleum; potential human carcinogens', severity: 'high', weight: 25 },
  { name: 'Hydroquinone', terms: ['hydroquinone'], category: 'carcinogen', reason: 'Linked to cancer in animal studies; restricted in many countries', severity: 'high', weight: 25 },
  { name: 'Triclosan', terms: ['triclosan','triclocarban'], category: 'endocrine-disruptor', reason: 'Disrupts thyroid hormones; contributes to antibiotic resistance', severity: 'high', weight: 25 },
  { name: 'Synthetic fragrance', terms: ['fragrance','parfum','perfume'], category: 'allergen', reason: 'Umbrella term hiding hundreds of undisclosed chemicals including phthalates', severity: 'medium', weight: 15 },
  { name: 'PEGs', terms: ['peg-','polyethylene glycol','ceteareth-','laureth-','steareth-'], category: 'carcinogen', reason: 'Manufacturing may introduce carcinogenic 1,4-dioxane contamination', severity: 'medium', weight: 15 },
  { name: 'BHA & BHT', terms: ['butylated hydroxyanisole','butylated hydroxytoluene'], category: 'endocrine-disruptor', reason: 'Possible carcinogens and endocrine disruptors', severity: 'medium', weight: 15 },
  { name: 'Ethanolamines', terms: ['diethanolamine','triethanolamine','cocamide dea','lauramide dea'], category: 'carcinogen', reason: 'Can form carcinogenic nitrosamines; restricted in EU', severity: 'medium', weight: 15 },
  { name: 'Resorcinol', terms: ['resorcinol'], category: 'endocrine-disruptor', reason: 'Thyroid disruptor; skin sensitizer', severity: 'medium', weight: 10 },
  { name: 'Talc', terms: ['talc','talcum'], category: 'carcinogen', reason: 'May be contaminated with asbestos', severity: 'low', weight: 5 },
  { name: 'Petrolatum', terms: ['petrolatum','paraffinum liquidum'], category: 'carcinogen', reason: 'Impure grades may contain carcinogenic PAHs', severity: 'low', weight: 5 },
]

export function scanIngredients(ingredientText: string): IngredientFlag[] {
  if (!ingredientText) return []
  const lower = ' ' + ingredientText.toLowerCase() + ' '
  return HARMFUL_INGREDIENTS.filter(bad =>
    bad.terms.some(term => lower.includes(term.toLowerCase()))
  ).map(({ name, category, reason, severity }) => ({ name, category, reason, severity }))
}

export function computeCleanScore(ingredientText: string): number {
  if (!ingredientText) return 50
  const lower = ' ' + ingredientText.toLowerCase() + ' '
  let deduction = 0
  for (const bad of HARMFUL_INGREDIENTS) {
    if (bad.terms.some(t => lower.includes(t.toLowerCase()))) {
      deduction += bad.weight
    }
  }
  return Math.max(0, 100 - deduction)
}
