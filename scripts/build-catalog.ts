import fs from 'fs'
import https from 'https'

const OUTPUT_PATH = './lib/catalog-generated.json'

interface MakeupProduct {
  id: number
  name: string
  brand: string
  price: string
  product_type: string
  description: string
  tag_list: string[]
  ingredients: string | null
  image_link: string
  product_link: string
  rating: number | null
}

function detectType(productType: string, name: string): string {
  const t = (productType + ' ' + name).toLowerCase()
  if (t.includes('serum')) return 'Serum'
  if (t.includes('cleanser') || t.includes('face wash') || t.includes('wash')) return 'Cleanser'
  if (t.includes('sunscreen') || t.includes('spf') || t.includes('sun')) return 'Sunscreen'
  if (t.includes('toner') || t.includes('toning')) return 'Toner'
  if (t.includes('eye cream') || t.includes('eye gel')) return 'Eye cream'
  if (t.includes('exfoliant') || t.includes('peel') || t.includes('scrub')) return 'Exfoliant'
  if (t.includes('oil') && !t.includes('control')) return 'Face oil'
  if (t.includes('mask') || t.includes('masque')) return 'Mask'
  if (t.includes('moisturizer') || t.includes('moisturising') || t.includes('cream') || t.includes('lotion')) return 'Moisturizer'
  return 'Moisturizer'
}

function inferSkinTypes(text: string): string[] {
  const t = text.toLowerCase()
  const types: string[] = []
  if (t.includes('oil-free') || t.includes('oil free') || t.includes('mattif') || t.includes('noncomedogenic')) types.push('oily', 'acne-prone')
  if (t.includes('dry') || t.includes('nourish') || t.includes('shea') || t.includes('ceramide')) types.push('dry')
  if (t.includes('sensitive') || t.includes('fragrance-free') || t.includes('calming') || t.includes('gentle')) types.push('sensitive')
  if (t.includes('combination')) types.push('combination')
  if (t.includes('all skin') || t.includes('all types')) return ['all']
  if (t.includes('acne') || t.includes('salicylic') || t.includes('benzoyl')) types.push('acne-prone')
  return types.length > 0 ? [...new Set(types)] : ['all']
}

function inferConcerns(name: string, description: string, tags: string[], ingredients: string): string[] {
  const t = (name + ' ' + description + ' ' + tags.join(' ') + ' ' + ingredients).toLowerCase()
  const c: string[] = []
  if (t.includes('salicylic') || t.includes('benzoyl') || t.includes('acne') || t.includes('blemish')) c.push('Acne / breakouts')
  if (t.includes('ascorbic') || t.includes('vitamin c') || t.includes('brightening') || t.includes('dark spot') || t.includes('hyperpigment')) c.push('Dark spots / hyperpigmentation')
  if (t.includes('retinol') || t.includes('peptide') || t.includes('anti-aging') || t.includes('firming') || t.includes('wrinkle')) c.push('Fine lines / wrinkles')
  if (t.includes('centella') || t.includes('calming') || t.includes('redness') || t.includes('soothing') || t.includes('rosacea')) c.push('Redness / rosacea')
  if (t.includes('glycolic') || t.includes('lactic') || t.includes('aha') || t.includes('exfoliat') || t.includes('texture')) c.push('Dullness / uneven texture')
  if (t.includes('pore') || t.includes('niacinamide') || t.includes('clay') || t.includes('zinc')) c.push('Large pores')
  if (t.includes('hyaluronic') || t.includes('ceramide') || t.includes('hydrat') || t.includes('moisture') || t.includes('glycerin')) c.push('Dryness / dehydration')
  if (t.includes('caffeine') || t.includes('dark circle') || t.includes('depuff') || t.includes('eye')) c.push('Dark circles')
  if (t.includes('spf') || t.includes('antioxidant') || t.includes('sun damage') || t.includes('uv')) c.push('Sun damage')
  if (t.includes('even') || t.includes('tone') || t.includes('kojic') || t.includes('arbutin') || t.includes('niacinamide')) c.push('Uneven skin tone')
  return c.length > 0 ? [...new Set(c)] : ['Dryness / dehydration']
}

function fetchProducts(productType: string): Promise<MakeupProduct[]> {
  return new Promise((resolve) => {
    const path = `/api/v1/products.json?product_type=${encodeURIComponent(productType)}`
    const options = {
      hostname: 'makeup-api.herokuapp.com',
      path,
      method: 'GET',
      headers: { 'User-Agent': 'Skinvra/1.0' },
    }
    http_get(options, resolve)
  })
}

function fetchAll(): Promise<MakeupProduct[]> {
  return new Promise((resolve) => {
    const options = {
      hostname: 'makeup-api.herokuapp.com',
      path: '/api/v1/products.json',
      method: 'GET',
      headers: { 'User-Agent': 'Skinvra/1.0' },
    }
    http_get(options, resolve)
  })
}

function http_get(options: object, resolve: (val: MakeupProduct[]) => void) {
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
}

async function buildCatalog() {
  console.log('Fetching from makeup-api.herokuapp.com...')
  const products: object[] = []
  const seen = new Set<number>()

  // Fetch all products at once
  const raw = await fetchAll()
  console.log(`Got ${raw.length} total products`)

  for (const p of raw) {
    if (seen.has(p.id)) continue
    seen.add(p.id)

    const ingredients = p.ingredients || ''
    const description = p.description || ''
    const tags = p.tag_list || []
    const allText = p.name + ' ' + description + ' ' + tags.join(' ') + ' ' + ingredients
    const productType = detectType(p.product_type || '', p.name || '')

    products.push({
      id: String(p.id),
      name: (p.name || '').trim(),
      brand: (p.brand || 'Unknown').trim(),
      price: parseFloat(p.price) || 0,
      productType,
      skinTypes: inferSkinTypes(allText),
      concerns: inferConcerns(p.name, description, tags, ingredients),
      ingredients: ingredients.trim(),
      description: description.replace(/<[^>]*>/g, '').trim() ||
        `${productType} by ${(p.brand || 'Unknown').trim()}.`,
      link: p.product_link || '',
      imageUrl: p.image_link || '',
      rating: p.rating || 0,
      reviewCount: 0,
    })
  }

  console.log(`Done: ${products.length} products collected`)

  if (products.length === 0) {
    console.error('No products found!')
    process.exit(1)
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(products, null, 2))
  console.log(`Written to ${OUTPUT_PATH}`)
}

buildCatalog().catch(console.error)
