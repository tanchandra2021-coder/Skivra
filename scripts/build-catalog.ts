import fs from 'fs'
import https from 'https'

const OUTPUT_PATH = './lib/catalog-generated.json'
const API_BASE = 'skincare-api.herokuapp.com'

interface RawProduct {
  id: number
  brand: string
  name: string
  ingredient_list: string[]
}

function detectType(name: string): string {
  const t = name.toLowerCase()
  if (t.includes('serum')) return 'Serum'
  if (t.includes('cleanser') || t.includes('face wash') || t.includes('cleansing') || t.includes('foam') || t.includes('cleanse')) return 'Cleanser'
  if (t.includes('sunscreen') || t.includes('spf') || t.includes('sun')) return 'Sunscreen'
  if (t.includes('toner') || t.includes('toning')) return 'Toner'
  if (t.includes('eye cream') || t.includes('eye gel') || t.includes('eye treatment')) return 'Eye cream'
  if (t.includes('exfoliant') || t.includes('exfoliating') || t.includes('peel') || t.includes('scrub')) return 'Exfoliant'
  if (t.includes('oil') && !t.includes('control')) return 'Face oil'
  if (t.includes('mask') || t.includes('masque') || t.includes('pack')) return 'Mask'
  if (t.includes('mist') || t.includes('essence') || t.includes('toner')) return 'Toner'
  return 'Moisturizer'
}

function inferSkinTypes(ingredients: string): string[] {
  const t = ingredients.toLowerCase()
  const types: string[] = []
  if (t.includes('salicylic') || t.includes('benzoyl') || t.includes('niacinamide')) types.push('oily', 'acne-prone')
  if (t.includes('shea') || t.includes('ceramide') || t.includes('squalane')) types.push('dry')
  if (t.includes('centella') || t.includes('allantoin') || t.includes('aloe')) types.push('sensitive')
  if (t.includes('hyaluronic') || t.includes('glycerin')) types.push('normal', 'combination')
  return types.length > 0 ? [...new Set(types)] : ['all']
}

function inferConcerns(name: string, ingredients: string): string[] {
  const t = (name + ' ' + ingredients).toLowerCase()
  const c: string[] = []
  if (t.includes('salicylic') || t.includes('benzoyl') || t.includes('acne') || t.includes('blemish')) c.push('Acne / breakouts')
  if (t.includes('ascorbic') || t.includes('vitamin c') || t.includes('brightening') || t.includes('dark spot') || t.includes('spot')) c.push('Dark spots / hyperpigmentation')
  if (t.includes('retinol') || t.includes('peptide') || t.includes('anti-aging') || t.includes('firming') || t.includes('wrinkle')) c.push('Fine lines / wrinkles')
  if (t.includes('centella') || t.includes('calming') || t.includes('redness') || t.includes('azelaic') || t.includes('soothing')) c.push('Redness / rosacea')
  if (t.includes('glycolic') || t.includes('lactic') || t.includes('aha') || t.includes('exfoliat') || t.includes('texture')) c.push('Dullness / uneven texture')
  if (t.includes('pore') || t.includes('niacinamide') || t.includes('clay') || t.includes('zinc')) c.push('Large pores')
  if (t.includes('hyaluronic') || t.includes('ceramide') || t.includes('hydrat') || t.includes('moisture') || t.includes('glycerin')) c.push('Dryness / dehydration')
  if (t.includes('caffeine') || t.includes('eye') || t.includes('dark circle') || t.includes('depuff')) c.push('Dark circles')
  if (t.includes('spf') || t.includes('antioxidant') || t.includes('vitamin e') || t.includes('sun')) c.push('Sun damage')
  if (t.includes('even') || t.includes('tone') || t.includes('kojic') || t.includes('niacinamide') || t.includes('arbutin')) c.push('Uneven skin tone')
  return c.length > 0 ? [...new Set(c)] : ['Dryness / dehydration']
}

function fetchProducts(page: number): Promise<RawProduct[]> {
  return new Promise((resolve) => {
    const path = `/products?limit=100&page=${page}`
    const options = {
      hostname: API_BASE,
      path,
      method: 'GET',
      headers: { 'User-Agent': 'Skinvra/1.0' },
    }
    https.get(options, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve(Array.isArray(json) ? json : [])
        } catch { resolve([]) }
      })
      res.on('error', () => resolve([]))
    })
  })
}

async function buildCatalog() {
  console.log('Fetching from skincare-api.herokuapp.com...')
  const products: object[] = []
  const seen = new Set<number>()

  for (let page = 1; page <= 25; page++) {
    console.log(`Fetching page ${page}...`)
    const raw = await fetchProducts(page)
    if (raw.length === 0) {
      console.log(`No more products at page ${page}, stopping.`)
      break
    }

    for (const p of raw) {
      if (seen.has(p.id)) continue
      seen.add(p.id)

      if (!p.name || !p.ingredient_list || p.ingredient_list.length < 3) continue

      const ingredientsStr = p.ingredient_list.join(', ')
      const productType = detectType(p.name)

      products.push({
        id: String(p.id),
        name: p.name.trim(),
        brand: (p.brand || 'Unknown').trim(),
        price: 0,
        productType,
        skinTypes: inferSkinTypes(ingredientsStr),
        concerns: inferConcerns(p.name, ingredientsStr),
        ingredients: ingredientsStr,
        description: `${productType} by ${(p.brand || 'Unknown').trim()}. Targets ${inferConcerns(p.name, ingredientsStr).slice(0, 2).join(' and ').toLowerCase()}.`,
        link: `https://skincare-api.herokuapp.com/products/${p.id}`,
        imageUrl: '',
        rating: 0,
        reviewCount: 0,
      })
    }

    console.log(`  Total so far: ${products.length}`)
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\nDone: ${products.length} products collected`)

  if (products.length === 0) {
    console.error('No products found!')
    process.exit(1)
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(products, null, 2))
  console.log(`Written to ${OUTPUT_PATH}`)
}

buildCatalog().catch(console.error)
