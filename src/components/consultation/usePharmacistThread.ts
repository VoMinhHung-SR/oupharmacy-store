'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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

type ThreadStatus = 'idle' | 'starting' | 'ready' | 'error'

export function usePharmacistThread(enabled: boolean) {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { openModal } = useLoginModal()
  const [status, setStatus] = useState<ThreadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<ConsultationSession | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ConsultFirestoreMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      startedRef.current = false
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
      return
    }
    if (startedRef.current) return
    startedRef.current = true

    let cancelled = false
    ;(async () => {
      setStatus('starting')
      setError(null)
      try {
        await upsertConsultUserProfile(user)
        const created = await createConsultationSession({
          need_text: '',
          context_json: { source: 'consult_chatbox' },
        })
        if (created.error || !created.data) {
          throw new Error(created.error || 'Không tạo được phiên tư vấn.')
        }
        if (cancelled) return
        const sessionRow = created.data
        const fsId = await createPharmacistConversation({
          userId: user.id,
          sessionId: sessionRow.id,
          needText: sessionRow.need_text,
        })
        const patched = await patchConsultationSession(sessionRow.id, {
          firestore_conversation_id: fsId,
        })
        if (cancelled) return
        setSession(patched.data || { ...sessionRow, firestore_conversation_id: fsId })
        setConversationId(fsId)
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        startedRef.current = false
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Không kết nối được tư vấn dược sĩ.')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [enabled, authLoading, isAuthenticated, user, openModal])

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
    waitingForPharmacist:
      session?.status === 'WAITING_FOR_PROFESSIONAL' ||
      (session != null && session.pharmacist_id == null),
  }
}
