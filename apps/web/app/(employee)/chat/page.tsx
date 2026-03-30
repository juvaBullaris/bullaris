'use client'

import { useState, useRef, useEffect } from 'react'
import { ConsentModal } from '@/components/consent-modal'
import { useLanguage } from '@/lib/language-context'
import { useConsent } from '@/lib/use-consent'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const { t } = useLanguage()
  const { hasConsent, isLoading: consentLoading, grant } = useConsent('ai_chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isStreaming) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsStreaming(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        if (data?.error?.code === 'DAILY_LIMIT') {
          setError(t.chat.errors.dailyLimit)
        } else {
          setError(t.chat.errors.generic)
        }
        setIsStreaming(false)
        return
      }

      const reader = response.body?.getReader()
      if (!reader) return

      let assistantContent = ''
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        assistantContent += chunk
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantContent }
          return updated
        })
      }
    } catch {
      setError(t.chat.errors.network)
    } finally {
      setIsStreaming(false)
    }
  }

  if (consentLoading) {
    return <div className="text-center py-12 text-muted-foreground text-sm">{t.common.loading}</div>
  }

  if (!hasConsent) {
    return (
      <ConsentModal
        module="ai_chat"
        onAccept={grant}
        onDecline={() => window.history.back()}
      />
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{t.chat.title}</h1>
        <p className="text-sm text-muted-foreground">{t.chat.subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border bg-card p-4 space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <div className="text-4xl">💬</div>
            <p className="text-muted-foreground text-sm max-w-sm">{t.chat.welcome}</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {[
                t.chat.suggestions.amBidrag,
                t.chat.suggestions.aSkat,
                t.chat.suggestions.personfradrag,
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="rounded-full border px-3 py-1 text-xs hover:bg-accent transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-bullaris-blue text-white' : 'bg-muted text-foreground'
              }`}
            >
              {msg.content}
              {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                <span className="inline-block w-1 h-4 bg-current ml-0.5 animate-pulse" />
              )}
            </div>
          </div>
        ))}
        {error && (
          <div className="rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm">{error}</div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chat.placeholder}
          disabled={isStreaming}
          className="flex-1 rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bullaris-blue disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className="rounded-md bg-bullaris-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {t.chat.send}
        </button>
      </form>
      <p className="text-xs text-muted-foreground mt-2 text-center">{t.chat.disclaimer}</p>
    </div>
  )
}
