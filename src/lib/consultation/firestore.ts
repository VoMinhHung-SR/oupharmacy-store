import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { db, FIRESTORE_APP_ENV } from '@/lib/config/firebase'

export const CONSULT_CONVERSATION_TYPE = 'pharmacist_consult' as const

export function conversationsCollection() {
  return collection(db, `${FIRESTORE_APP_ENV}_conversations`)
}

export function messagesCollection() {
  return collection(db, `${FIRESTORE_APP_ENV}_messages`)
}

export function usersCollectionPath() {
  return `${FIRESTORE_APP_ENV}_users`
}

export type ConsultFirestoreMessage = {
  id: string
  conversation_id: string
  text: string
  user: number
  sent_at: Date | null
}

/** Upsert patient profile so Clinic ConversationDetail can resolve recipient. */
export async function upsertConsultUserProfile(user: {
  id: number
  email: string
  first_name?: string
  last_name?: string
  name?: string
  avatar?: string
  avatar_path?: string
}) {
  const fullName =
    user.name?.trim() ||
    [user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
    user.email
  await setDoc(
    doc(db, usersCollectionPath(), String(user.id)),
    {
      id: user.id,
      email: user.email,
      fullName,
      avatar: user.avatar_path || user.avatar || '',
      lastSeen: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function createPharmacistConversation(input: {
  userId: number
  sessionId: number
  needText?: string
}): Promise<string> {
  const ref = await addDoc(conversationsCollection(), {
    members: [input.userId],
    type: CONSULT_CONVERSATION_TYPE,
    session_id: input.sessionId,
    need_text: (input.needText || '').trim(),
    created_at: serverTimestamp(),
  })
  return ref.id
}

/** After pharmacist claim — add pharmacist so Clinic inbox query sees the thread. */
export async function attachPharmacistToConversation(
  conversationId: string,
  patientId: number,
  pharmacistId: number,
) {
  await setDoc(
    doc(db, `${FIRESTORE_APP_ENV}_conversations`, conversationId),
    {
      members: [patientId, pharmacistId],
      pharmacist_id: pharmacistId,
    },
    { merge: true },
  )
}

export async function sendConsultMessage(input: {
  conversationId: string
  userId: number
  text: string
}) {
  const text = input.text.trim()
  if (!text) return
  await setDoc(
    doc(db, usersCollectionPath(), String(input.userId)),
    { lastSeen: serverTimestamp() },
    { merge: true },
  )
  await addDoc(messagesCollection(), {
    conversation_id: input.conversationId,
    sent_at: serverTimestamp(),
    text,
    user: input.userId,
  })
}

export function subscribeConsultMessages(
  conversationId: string,
  onData: (messages: ConsultFirestoreMessage[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    messagesCollection(),
    where('conversation_id', '==', conversationId),
    orderBy('sent_at', 'asc'),
  )
  return onSnapshot(
    q,
    (snap) => {
      const rows: ConsultFirestoreMessage[] = snap.docs.map((d) => {
        const data = d.data()
        const sent = data.sent_at
        return {
          id: d.id,
          conversation_id: String(data.conversation_id ?? conversationId),
          text: String(data.text ?? ''),
          user: Number(data.user),
          sent_at: sent?.toDate?.() ? sent.toDate() : null,
        }
      })
      onData(rows)
    },
    (err) => onError?.(err),
  )
}
