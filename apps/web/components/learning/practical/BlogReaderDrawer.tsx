'use client'

import { useEffect, useState } from 'react'
import type { BlogRead } from '@/lib/practical-topic-types'

interface ArticleData {
  title: string
  content: string
  byline: string | null
  siteName: string | null
  excerpt: string | null
}

interface Props {
  blog: BlogRead
  en: boolean
  onClose: () => void
}

export function BlogReaderDrawer({ blog, en, onClose }: Props) {
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [error, setError] = useState(false)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Fetch article content
  useEffect(() => {
    setArticle(null)
    setError(false)
    fetch(`/api/article-reader?url=${encodeURIComponent(blog.url)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(true); return }
        setArticle(data as ArticleData)
      })
      .catch(() => setError(true))
  }, [blog.url])

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#FDFAF7' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: '1px solid #EDE0D4', background: '#FFF8F3' }}
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9B8B7E' }}>
            {blog.source} · {blog.estimatedMins} min read
          </p>
          <p className="text-sm font-bold truncate mt-0.5" style={{ color: '#1E0F00' }}>
            {en ? blog.title.en : blog.title.da}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border"
            style={{ color: '#6B5C52', borderColor: '#EDE0D4', background: '#fff' }}
          >
            {en ? 'Original ↗' : 'Original ↗'}
          </a>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
            style={{ background: '#F5F0EB', color: '#1E0F00' }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {!article && !error && <LoadingSkeleton />}

        {error && (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
            <p className="text-4xl">📄</p>
            <p className="text-base font-bold" style={{ color: '#1E0F00' }}>
              {en ? "Couldn't load this article" : 'Artiklen kunne ikke indlæses'}
            </p>
            <p className="text-sm" style={{ color: '#9B8B7E' }}>
              {en ? 'The site may have blocked external access.' : 'Siden har muligvis blokeret ekstern adgang.'}
            </p>
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-6 py-3 text-sm font-bold"
              style={{ background: '#E8634A', color: '#fff' }}
            >
              {en ? 'Open original ↗' : 'Åbn original ↗'}
            </a>
          </div>
        )}

        {article && (
          <div className="max-w-2xl mx-auto px-5 py-8">
            {article.byline && (
              <p className="text-xs mb-6" style={{ color: '#9B8B7E' }}>
                {article.byline}
              </p>
            )}
            {/* URLs are developer-controlled — only hardcoded blog URLs are ever passed */}
            <div
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <div
              className="mt-10 pt-6 flex items-center justify-between"
              style={{ borderTop: '1px solid #EDE0D4' }}
            >
              <p className="text-xs" style={{ color: '#9B8B7E' }}>
                {en ? `Source: ${blog.source}` : `Kilde: ${blog.source}`}
              </p>
              <a
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold"
                style={{ color: '#E8634A' }}
              >
                {en ? 'View original ↗' : 'Se original ↗'}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-4 animate-pulse">
      <div className="h-4 rounded-full w-1/4" style={{ background: '#EDE0D4' }} />
      <div className="h-6 rounded-full w-3/4" style={{ background: '#EDE0D4' }} />
      <div className="h-6 rounded-full w-2/3" style={{ background: '#EDE0D4' }} />
      <div className="space-y-2 pt-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 rounded-full" style={{ background: '#EDE0D4', width: `${85 + (i % 3) * 5}%` }} />
        ))}
      </div>
      <div className="space-y-2 pt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 rounded-full" style={{ background: '#EDE0D4', width: `${80 + (i % 4) * 4}%` }} />
        ))}
      </div>
    </div>
  )
}
