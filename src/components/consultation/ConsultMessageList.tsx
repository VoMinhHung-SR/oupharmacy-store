'use client'

import React from 'react'

export type ConsultMessageRole = 'system' | 'user' | 'assistant'

export type ConsultMessage = {
  id: string
  role: ConsultMessageRole
  body: React.ReactNode
}

type ConsultMessageListProps = {
  messages: ConsultMessage[]
}

export function ConsultMessageList({ messages }: ConsultMessageListProps) {
  return (
    <div className="flex flex-col gap-3" role="log" aria-live="polite" aria-relevant="additions">
      {messages.map((msg) => {
        const align =
          msg.role === 'user' ? 'items-end' : msg.role === 'system' ? 'items-stretch' : 'items-start'
        const bubble =
          msg.role === 'user'
            ? 'bg-primary-600 text-white'
            : msg.role === 'system'
              ? 'border border-amber-200 bg-amber-50 text-amber-950'
              : 'border border-slate-200 bg-white text-slate-800'

        return (
          <div key={msg.id} className={`flex flex-col ${align}`}>
            <div className={`max-w-[95%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${bubble}`}>
              {msg.body}
            </div>
          </div>
        )
      })}
    </div>
  )
}
