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

type ConsultAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SELECT_INTENT'; intent: ConsultIntent }
  | { type: 'BACK_TO_MENU' }

function consultReducer(step: ConsultStep, action: ConsultAction): ConsultStep {
  switch (action.type) {
    case 'OPEN':
      return 'menu'
    case 'CLOSE':
      return 'idle'
    case 'BACK_TO_MENU':
      return step === 'idle' ? 'idle' : 'menu'
    case 'SELECT_INTENT':
      // Allow while UI shows menu before OPEN effect lands (idle → menu flash).
      if (step !== 'menu' && step !== 'idle') return step
      if (action.intent === 'pharmacist') return 'pharmacist'
      if (action.intent === 'doctor') return 'doctor_guide'
      return 'medicine_query'
    default:
      return step
  }
}

export function useConsultStateMachine(initial: ConsultStep = 'idle') {
  const [step, dispatch] = useReducer(consultReducer, initial)

  const open = useCallback(() => dispatch({ type: 'OPEN' }), [])
  const close = useCallback(() => dispatch({ type: 'CLOSE' }), [])
  const backToMenu = useCallback(() => dispatch({ type: 'BACK_TO_MENU' }), [])
  const selectIntent = useCallback(
    (intent: ConsultIntent) => dispatch({ type: 'SELECT_INTENT', intent }),
    [],
  )

  return {
    step,
    isOpen: step !== 'idle',
    open,
    close,
    backToMenu,
    selectIntent,
  }
}
