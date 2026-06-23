import fs from 'fs'
import https from 'https'

const OUTPUT_PATH = './lib/catalog-generated.json'

interface RawProduct {
  code?: string
  product_name?: string
  brands?: string
  categories?: string
  ingredients_text?: string
  image_url?: string
}

function detectType(categories: string, name: string): string {
  const t = (categories + ' ' + name).toLowerCase()
  if (t.includes('serum')) return 'Serum'
  if (t.includes('cleanser') || t.includes('face wash')) return 'Cleanser'
  if (t.includes('sunscreen') || t.includes('spf')) return 'Sunscreen'
  if (t.includes('toner')) return 'Toner'
  if (t.includes('eye cream')) return 'Eye cream'
  if (t.includes('exfoliant') || t.includes('peel') || t.includes('scrub')) return 'Exfoliant'
  if (t.includes('face oil')) return 'Face oil'
  if (t.includes('mask') || t.includes('masque')) return 'Mask'
  return 'Moisturizer'
}

function inferSkinTypes(text: string): string[] {
  const t = text.toLowerCase()
  const types: string[] = []
  if (t.includes('oil-free') || t.includes('mattif') || t.includes('noncomedogenic')) types.push('oily', 'acne-prone')
  if (t.includes('dry skin') || t.includes('nourishing') || t.includes('shea')) types.push('dry')
  if (t.includes('sensitive') || t.includes('fragrance-free') || t.includes('calming')) types.push('sensitive')
  if (t.includes('combination')) types.push('combination')
  if (t.includes('all skin') || t.includes('all types')) return ['all']
  if (t.includes('acne') || t.includes('salicylic') || t.includes('benzoyl')) types.push('acne-prone')
  return types.length > 0 ? [...new Set(types)] : ['all']
}

function inferConcerns(text: string): string[] {
  const t = text.toLowerCase()
  const c: string[] = []
  if (t.includes('salicylic') || t.includes('benzoyl') || t.includes('acne')) c.push('Acne / breakouts')
  if (t.includes('vitamin c') || t.includes('ascorbic') || t.includes('brightening') || t.includes('dark spot')) c.push('Dark spots / hyperpigmentation')
  if (t.includes('retinol') || t.includes('peptide') || t.includes('anti-aging') || t.includes('firming')) c.push('Fine lines / wrinkles')
  if (t.includes('centella') || t.includes('calming') || t.includes('redness') || t.includes('azelaic')) c.push('Redness / rosacea')
  if (t.includes('glycolic') || t.includes('lactic') || t.includes('aha') || t.includes('texture')) c.push('Dullness / uneven texture')
  if (t.includes('pore') || t.includes('minimiz')) c.push('Large pores')
  if (t.includes('hyaluronic') || t.includes('ceramide') || t.includes('hydrat')) c.push('Dryness / dehydration')
  if (t.includes('caffeine') || t.includes('dark circle') || t.includes('depuff')) c.push('Dark circles')
  if (t.includes('spf') || t.includes('antioxidant') || t.includes('sun damage')) c.push('Sun damage')
  return c.length > 0 ? [...new Set(c)] : ['Dryness / dehydration']
}

function fetchFromAPI(searchTerm: string, page: number): Promise<RawProduct[]> {
  return new Promise((resolve) => {
    const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&search_simple=1&action=process&json=1&page_size=100&page=${page}`
    https.get(url, { headers: { 'User-Agent': 'Skinvra/1.0' } }, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve(json.products || [])
        } catch { resolve([]) }
      })
      res.on('error', () => resolve([]))
    })
  })
}

async function buildCatalog() {
  console.log('Fetching from Open Beauty Facts API...')
  const products: object[] = []
  const seen = new Set<string>()

  const searchTerms = [
    'face moisturizer',
    'facial serum',
    'face cleanser',
    'face wash',
    'sunscreen face',
    'facial toner',
    'eye cream',
    'face oil',
    'face mask',
    'facial exfoliant',
    'skin care moisturizer',
    'anti aging serum',
    'vitamin c serum',
    'hyaluronic acid',
    'retinol cream',
    'niacinamide serum',
    'salicylic acid cleanser',
    'ceramide moisturizer',
  ]

  for (const term of searchTerms) {
    console.log(`Fetching: ${term}...`)
    for (let page = 1; page <= 3; page++) {
      const raw = await fetchFromAPI(term, page)
      if (raw.length === 0) break

      for (const p of raw) {
        if (!p.product_name || !p.ingredients_text || seen.has(p.code || '')) continue
        if (p.ingredients_text.length < 30) continue
        seen.add(p.code || '')

        const allText = (p.ingredients_text || '') + ' ' + (p.categories || '') + ' ' + (p.product_name || '')
        const productType = detectType(p.categories || '', p.product_name || '')

        products.push({
          id: p.code || String(Math.random()),
          name: p.product_name.trim(),
          brand: (p.brands || 'Unknown').split(',')[0].trim(),
          price: 0,
          productType,
          skinTypes: inferSkinTypes(allText),
          concerns: inferConcerns(allText),
          ingredients: p.ingredients_text.trim(),
          description: `${productType} by ${(p.brands || '').split(',')[0].trim()}. Targets ${inferConcerns(allText).slice(0, 2).join(' and ').toLowerCase()}.`,
          link: `https://world.openbeautyfacts.org/product/${p.code}`,
          imageUrl: p.image_url || '',
          rating: 0,
          reviewCount: 0,
        })
      }

      await new Promise(r => setTimeout(r, 300))
    }
  }

  console.log(`\nDone: ${products.length} products collected`)

  if (products.length === 0) {
    console.log('WARNING: No products found! Check API connectivity.')
    process.exit(1)
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(products, null, 2))
  console.log(`Written to ${OUTPUT_PATH}`)
}

buildCatalog().catch(console.error)
