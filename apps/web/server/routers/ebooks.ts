import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

// Ebooks live entirely in Sanity — no DB table needed.
// This router fetches from Sanity and gates access behind auth.

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const SANITY_API_VERSION = '2024-01-01'

async function sanityFetch<T>(query: string): Promise<T> {
  const encodedQuery = encodeURIComponent(query)
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodedQuery}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`)
  const json = await res.json()
  return json.result as T
}

export type Ebook = {
  _id: string
  title: string
  description: string
  coverImageUrl: string | null
  author: string
  publishedYear: number
  externalUrl: string
  tags: string[]
  language: 'da' | 'en'
}

export const ebooksRouter = router({
  /**
   * List all ebooks — accessible to authenticated employees only.
   * externalUrl is only returned here, never exposed to unauthenticated requests.
   */
  list: protectedProcedure
    .input(
      z.object({
        tag: z.string().optional(),
        language: z.enum(['da', 'en']).optional(),
      })
    )
    .query(async ({ input }) => {
      const tagFilter = input.tag ? `&& "${input.tag}" in tags` : ''
      const langFilter = input.language ? `&& language == "${input.language}"` : ''

      const query = `*[_type == "ebook" ${tagFilter} ${langFilter}] | order(publishedYear desc) {
        _id,
        title,
        description,
        "coverImageUrl": coverImage.asset->url,
        author,
        publishedYear,
        externalUrl,
        tags,
        language
      }`

      const ebooks = await sanityFetch<Ebook[]>(query)
      return ebooks
    }),

  /**
   * Get a single ebook by Sanity ID.
   */
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const query = `*[_type == "ebook" && _id == "${input.id}"][0] {
        _id,
        title,
        description,
        "coverImageUrl": coverImage.asset->url,
        author,
        publishedYear,
        externalUrl,
        tags,
        language
      }`

      const ebook = await sanityFetch<Ebook | null>(query)
      return ebook
    }),

  /**
   * List all unique tags for filtering.
   */
  tags: protectedProcedure.query(async () => {
    const query = `array::unique(*[_type == "ebook"].tags[])`
    const tags = await sanityFetch<string[]>(query)
    return tags.filter(Boolean).sort()
  }),
})
