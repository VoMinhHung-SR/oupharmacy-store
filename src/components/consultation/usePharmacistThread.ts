'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import {
  createConsultationSession,
  patchConsultationSession,
  type ConsultationSession,
} from '@/lib/services/consultation'
import {
  createPharmacistConversation,
  sendConsultMessage,
  subscribeConsultMessages,
  upsertConsultUserProfile,
  type ConsultFirestoreMessage,
} from '@/lib/consultation/firestore'
import type { PharmacistSeed } from './useConsultStateMachine'

type ThreadStatus = 'idle' | 'starting' | 'ready' | 'error'

export function usePharmacistThread(enabled: boolean, seed: PharmacistSeed | null = null) {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { openModal } = useLoginModal()
  const [status, setStatus] = useState<ThreadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<ConsultationSession | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ConsultFirestoreMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const seedNeedText = seed?.need_text?.trim() || ''
  const seedSource =
    typeof seed?.context_json?.source === 'string'
      ? seed.context_json.source
      : 'consult_chatbox'

  useEffect(() => {
    if (!enabled) {
      setStatus('idle')
      setError(null)
      setSession(null)
      setConversationId(null)
      setMessages([])
      setDraft('')
      return
    }
    if (authLoading) return
    if (!isAuthenticated || !user) {
      openModal()
      setStatus('idle')
      return
    }

    let cancelled = false
    setStatus('starting')
    setError(null)

    ;(async () => {
      try {
        await upsertConsultUserProfile(user)
        if (cancelled) return

        const context_json: Record<string, unknown> = {
          source: seedSource,
          ...(seed?.context_json || {}),
        }

        const created = await createConsultationSession({
          need_text: seedNeedText,
          context_json,
        })
        if (created.error || !created.data) {
          throw new Error(created.error || 'Không tạo được phiên tư vấn.')
        }
        if (cancelled) return

        const sessionRow = created.data
        const fsId = await createPharmacistConversation({
          userId: user.id,
          sessionId: sessionRow.id,
          needText: sessionRow.need_text || seedNeedText,
        })
        if (cancelled) return

        const patched = await patchConsultationSession(sessionRow.id, {
          firestore_conversation_id: fsId,
        })
        if (cancelled) return

        setSession(patched.data || { ...sessionRow, firestore_conversation_id: fsId })
        setConversationId(fsId)
        setStatus('ready')

        if (seedNeedText) {
          try {
            await sendConsultMessage({
              conversationId: fsId,
              userId: user.id,
              text: seedNeedText,
            })
          } catch {
            // Session is usable even if seed message fails.
          }
        }
      } catch (err) {
        if (cancelled) return
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Không kết nối được tư vấn dược sĩ.')
      }
    })()

    return () => {
      cancelled = true
    }
    // Seed fields only — avoid recreating when parent passes a new object identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seedNeedText/seedSource capture escalate payload
  }, [enabled, authLoading, isAuthenticated, user, openModal, seedNeedText, seedSource])

  useEffect(() => {
    if (!conversationId || !enabled) return
    return subscribeConsultMessages(
      conversationId,
      setMessages,
      (err) => setError(err.message),
    )
  }, [conversationId, enabled])

  const send = useCallback(async () => {
    if (!user || !conversationId || !draft.trim() || sending) return
    setSending(true)
    try {
      await sendConsultMessage({
        conversationId,
        userId: user.id,
        text: draft,
      })
      setDraft('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi tin nhắn thất bại.')
    } finally {
      setSending(false)
    }
  }, [user, conversationId, draft, sending])

  const waitingForPharmacist =
    status === 'ready' &&
    (session?.status === 'WAITING_FOR_PROFESSIONAL' || session?.pharmacist_id == null)

  return {
    status,
    error,
    session,
    conversationId,
    messages,
    draft,
    setDraft,
    send,
    sending,
    userId: user?.id ?? null,
    waitingForPharmacist,
  }
}
