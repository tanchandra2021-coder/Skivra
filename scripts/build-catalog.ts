import fs from 'fs'
import https from 'https'
import zlib from 'zlib'
import { Transform } from 'stream'

const OUTPUT_PATH = './lib/catalog-generated.json'
const CSV_URL = 'https://static.openbeautyfacts.org/data/en.openbeautyfacts.org.products.csv.gz'

function detectType(categories: string, name: string): string {
  const t = (categories + ' ' + name).toLowerCase()
  if (t.includes('serum')) return 'Serum'
  if (t.includes('cleanser') || t.includes('face wash')) return 'Cleanser'
  if (t.includes('sunscreen') || t.includes('spf')) return 'Sunscreen'
  if (t.includes('toner')) return 'Toner'
  if (t.includes('eye cream') || t.includes('eye treatment')) return 'Eye cream'
  if (t.includes('exfoliant') || t.includes('peel') || t.includes('scrub')) return 'Exfoliant'
  if (t.includes('face oil') || t.includes('facial oil')) return 'Face oil'
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
  if (t.includes('even') || t.includes('kojic') || t.includes('niacinamide')) c.push('Uneven skin tone')
  return c.length > 0 ? [...new Set(c)] : ['Dryness / dehydration']
}

function isSkincare(categories: string, name: string): boolean {
  const t = (categories + ' ' + name).toLowerCase()
  const skincareTerms = [
    'moisturizer', 'serum', 'cleanser', 'face wash', 'sunscreen',
    'toner', 'eye cream', 'face oil', 'mask', 'masque', 'exfoliant',
    'skincare', 'skin care', 'facial', 'face cream', 'night cream',
    'day cream', 'anti-aging', 'anti aging', 'face lotion',
  ]
  return skincareTerms.some(term => t.includes(term))
}

// Simple TSV parser that handles quoted fields
function parseTSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === '\t' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += char
    }
  }
  fields.push(current)
  return fields
}

async function buildCatalog() {
  console.log('Downloading Open Beauty Facts CSV...')
  console.log('(This is the official cosmetics export from static.openbeautyfacts.org)')

  const products: object[] = []
  const seen = new Set<string>()
  let headers: string[] = []
  let lineCount = 0
  let kept = 0
  let buffer = ''

  await new Promise<void>((resolve, reject) => {
    https.get(CSV_URL, { headers: { 'User-Agent': 'Skinvra/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirect = res.headers.location || ''
        console.log(`Redirecting to ${redirect}`)
        https.get(redirect, { headers: { 'User-Agent': 'Skinvra/1.0' } }, (res2) => {
          processStream(res2)
        }).on('error', reject)
        return
      }
      processStream(res)

      function processStream(stream: NodeJS.ReadableStream) {
        const gunzip = zlib.createGunzip()
        stream.pipe(gunzip)

        gunzip.on('data', (chunk: Buffer) => {
          buffer += chunk.toString('utf8')
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim()) continue
            lineCount++

            if (lineCount === 1) {
              headers = parseTSVLine(line)
              console.log(`Headers found: ${headers.length} columns`)
              continue
            }

            const fields = parseTSVLine(line)
            const row: Record<string, string> = {}
            headers.forEach((h, i) => { row[h] = fields[i] || '' })

            const name = row['product_name'] || ''
            const ingredients = row['ingredients_text'] || ''
            const categories = row['categories'] || ''
            const code = row['code'] || ''
            const brand = row['brands'] || ''

            if (!name || !ingredients || ingredients.length < 30) continue
            if (!isSkincare(categories, name)) continue
            if (seen.has(code)) continue
            seen.add(code)

            const allText = ingredients + ' ' + categories + ' ' + name
            const productType = detectType(categories, name)

            products.push({
              id: code || String(Math.random()),
              name: name.trim(),
              brand: brand.split(',')[0].trim() || 'Unknown',
              price: 0,
              productType,
              skinTypes: inferSkinTypes(allText),
              concerns: inferConcerns(allText),
              ingredients: ingredients.trim(),
              description: `${productType} by ${brand.split(',')[0].trim() || 'Unknown'}. Targets ${inferConcerns(allText).slice(0, 2).join(' and ').toLowerCase()}.`,
              link: `https://world.openbeautyfacts.org/product/${code}`,
              imageUrl: row['image_url'] || '',
              rating: 0,
              reviewCount: 0,
            })
            kept++

            if (kept % 500 === 0) {
              process.stdout.write(`\r${kept} skincare products kept from ${lineCount} lines scanned`)
            }
          }
        })

        gunzip.on('end', resolve)
        gunzip.on('error', reject)
        stream.on('error', reject)
      }
    }).on('error', reject)
  })

  console.log(`\nDone: ${kept} skincare products from ${lineCount} total lines`)

  if (products.length === 0) {
    console.error('No products found!')
    process.exit(1)
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(products, null, 2))
  console.log(`Written to ${OUTPUT_PATH}`)
}

buildCatalog().catch(console.error)
