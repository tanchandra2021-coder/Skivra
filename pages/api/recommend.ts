import type { NextApiRequest, NextApiResponse } from 'next'
import { scoreProducts } from '@/lib/scoring'
import type { SkinProfile } from '@/lib/types'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const profile = req.body as SkinProfile
  if (!profile.skinType) return res.status(400).json({ error: 'Skin type required' })

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const catalog = require('@/lib/catalog-generated.json')
  const products = scoreProducts(profile, Array.isArray(catalog) ? catalog : catalog.default)
  return res.status(200).json({ products })
}
