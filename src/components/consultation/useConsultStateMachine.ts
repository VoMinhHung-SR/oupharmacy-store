'use client'

import { useCallback, useReducer } from 'react'

/** Deterministic consult hub steps — no NLP/LLM. */
export type ConsultStep =
  | 'idle'
  | 'menu'
  | 'pharmacist'
  | 'doctor_guide'
  | 'medicine_query'

export type ConsultIntent = 'pharmacist' | 'doctor' | 'medicine'

/** Optional seed when opening pharmacist (e.g. CONSULT product escalate). */
export type PharmacistSeed = {
  need_text?: string
  context_json?: Record<string, unknown>
}

type MachineState = {
  step: ConsultStep
  pharmacistSeed: PharmacistSeed | null
}

type ConsultAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SELECT_INTENT'; intent: ConsultIntent }
  | { type: 'BACK_TO_MENU' }
  | { type: 'ESCALATE_PHARMACIST'; seed: PharmacistSeed }

function consultReducer(state: MachineState, action: ConsultAction): MachineState {
  switch (action.type) {
    case 'OPEN':
      return { step: 'menu', pharmacistSeed: null }
    case 'CLOSE':
      return { step: 'idle', pharmacistSeed: null }
    case 'BACK_TO_MENU':
      if (state.step === 'idle') return state
      return { step: 'menu', pharmacistSeed: null }
    case 'SELECT_INTENT':
      if (state.step !== 'menu' && state.step !== 'idle') return state
      if (action.intent === 'pharmacist') {
        return { step: 'pharmacist', pharmacistSeed: null }
      }
      if (action.intent === 'doctor') {
        return { step: 'doctor_guide', pharmacistSeed: null }
      }
      return { step: 'medicine_query', pharmacistSeed: null }
    case 'ESCALATE_PHARMACIST':
      if (state.step === 'idle') return state
      return { step: 'pharmacist', pharmacistSeed: action.seed }
    default:
      return state
  }
}

export function useConsultStateMachine(initial: ConsultStep = 'idle') {
  const [state, dispatch] = useReducer(consultReducer, {
    step: initial,
    pharmacistSeed: null,
  })

  const open = useCallback(() => dispatch({ type: 'OPEN' }), [])
  const close = useCallback(() => dispatch({ type: 'CLOSE' }), [])
  const backToMenu = useCallback(() => dispatch({ type: 'BACK_TO_MENU' }), [])
  const selectIntent = useCallback(
    (intent: ConsultIntent) => dispatch({ type: 'SELECT_INTENT', intent }),
    [],
  )
  const escalateToPharmacist = useCallback(
    (seed: PharmacistSeed) => dispatch({ type: 'ESCALATE_PHARMACIST', seed }),
    [],
  )

  return {
    step: state.step,
    pharmacistSeed: state.pharmacistSeed,
    isOpen: state.step !== 'idle',
    open,
    close,
    backToMenu,
    selectIntent,
    escalateToPharmacist,
  }
}
