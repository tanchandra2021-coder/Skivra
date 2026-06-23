import fs from 'fs'
import https from 'https'
import zlib from 'zlib'

const OBF_DUMP_URL = 'https://world.openbeautyfacts.org/data/openfoodfacts-products.jsonl.gz'
const OUTPUT_PATH = './lib/catalog-generated.json'

const SKINCARE_CATEGORIES = [
  'moisturizer','moisturizers','serum','serums','cleanser','cleansers',
  'face wash','toner','toners','sunscreen','eye cream','eye creams',
  'face oil','face oils','mask','masks','exfoliant','exfoliants',
  'facial care','skin care','skincare','face care','face cream',
  'night cream','day cream',
]

interface RawProduct {
  code?: string
  product_name?: string
  brands?: string
  categories?: string
  categories_tags?: string[]
  ingredients_text?: string
  image_url?: string
  [key: string]: unknown
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

function isSkincare(p: RawProduct): boolean {
  const cats = (p.categories || '').toLowerCase()
  const tags = (p.categories_tags || []).join(' ').toLowerCase()
  const inCat = SKINCARE_CATEGORIES.some(c => cats.includes(c) || tags.includes(c))
  return inCat && !!(p.ingredients_text) && p.ingredients_text.length > 30 && !!(p.product_name)
}

async function buildCatalog() {
  console.log('Downloading Open Beauty Facts...')
  const products: object[] = []
  let total = 0, kept = 0
  let buffer = ''

  await new Promise<void>((resolve, reject) => {
    https.get(OBF_DUMP_URL, (res) => {
      const gunzip = zlib.createGunzip()
      res.pipe(gunzip)
      gunzip.on('data', (chunk: Buffer) => {
        buffer += chunk.toString()
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (!line.trim()) continue
          total++
          try {
            const raw: RawProduct = JSON.parse(line)
            if (!isSkincare(raw)) continue
            const allText = (raw.ingredients_text || '') + ' ' + (raw.categories || '') + ' ' + (raw.product_name || '')
            const productType = detectType(raw.categories || '', raw.product_name || '')
            products.push({
              id: raw.code || String(Math.random()),
              name: raw.product_name!.trim(),
              brand: (raw.brands || 'Unknown').split(',')[0].trim(),
              price: 0,
              productType,
              skinTypes: inferSkinTypes(allText),
              concerns: inferConcerns(allText),
              ingredients: raw.ingredients_text!.trim(),
              description: `${productType} by ${(raw.brands || '').split(',')[0].trim()}. Targets ${inferConcerns(allText).slice(0, 2).join(' and ').toLowerCase()}.`,
              link: `https://world.openbeautyfacts.org/product/${raw.code}`,
              imageUrl: raw.image_url || '',
              rating: 0,
              reviewCount: 0,
            })
            kept++
            if (kept % 500 === 0) process.stdout.write(`\r${kept} kept / ${total} scanned`)
          } catch { /* skip malformed */ }
        }
      })
      gunzip.on('end', resolve)
      gunzip.on('error', reject)
      res.on('error', reject)
    })
  })

  console.log(`\nDone: ${kept} skincare products from ${total} total`)
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(products, null, 2))
  console.log(`Written to ${OUTPUT_PATH}`)
}

buildCatalog().catch(console.error)
