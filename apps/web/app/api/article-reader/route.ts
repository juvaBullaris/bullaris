import { NextRequest, NextResponse } from 'next/server'
import { Readability } from '@mozilla/readability'
import { parseHTML } from 'linkedom'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'missing url' }, { status: 400 })
  }

  let decoded: string
  try {
    decoded = decodeURIComponent(url)
    new URL(decoded)
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }

  let html: string
  try {
    const res = await fetch(decoded, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Bullaris-Reader/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'fetch_failed' }, { status: 502 })
    }
    html = await res.text()
  } catch {
    return NextResponse.json({ error: 'fetch_failed' }, { status: 502 })
  }

  try {
    const { document } = parseHTML(html)
    // Readability needs the document URL to resolve relative links
    ;(document as unknown as { baseURI: string }).baseURI = decoded
    const reader = new Readability(document as unknown as Document)
    const article = reader.parse()
    if (!article) {
      return NextResponse.json({ error: 'parse_failed' }, { status: 422 })
    }
    return NextResponse.json({
      title: article.title,
      content: article.content,
      byline: article.byline,
      siteName: article.siteName,
      excerpt: article.excerpt,
    })
  } catch {
    return NextResponse.json({ error: 'parse_failed' }, { status: 422 })
  }
}
