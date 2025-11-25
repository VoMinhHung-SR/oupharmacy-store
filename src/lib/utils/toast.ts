import toast from 'react-hot-toast'
import { TOAST_TYPE } from '../constant'

interface ToastOptions {
  duration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  style?: React.CSSProperties
}

interface CreateToastParams {
  type: typeof TOAST_TYPE.SUCCESS | typeof TOAST_TYPE.ERROR | typeof TOAST_TYPE.WARNING | typeof TOAST_TYPE.INFO
  message: string
  options?: ToastOptions
}

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'bottom-right',
  style: {
    background: '#363636',
    color: '#fff',
  },
}

/**
 * Create and display toast message
 * @param {CreateToastParams} params - Object contains type, message and options
 * @returns {string} Toast ID
 */
export const createToastMessage = ({ type, message, options = {} }: CreateToastParams): string => {
  const toastOptions = {
    ...defaultOptions,
    ...options,
  }

  switch (type) {
    case TOAST_TYPE.SUCCESS:
      return toast.success(message, {
        duration: toastOptions.duration,
        position: toastOptions.position,
      })
    case TOAST_TYPE.ERROR:
      return toast.error(message, {
        duration: toastOptions.duration || 4000,
        position: toastOptions.position,
      })
    default:
      return toast(message, {
        duration: toastOptions.duration,
        position: toastOptions.position,
      })
  }
}

/**
 * Helper functions for each toast type
 */
export const toastSuccess = (message: string, options?: ToastOptions) => {
  return createToastMessage({ type: TOAST_TYPE.SUCCESS, message, options })
}

export const toastError = (message: string, options?: ToastOptions) => {
  return createToastMessage({ type: TOAST_TYPE.ERROR, message, options })
}

export const toastWarning = (message: string, options?: ToastOptions) => {
  return createToastMessage({ type: TOAST_TYPE.WARNING, message, options })
}

export const toastInfo = (message: string, options?: ToastOptions) => {
  return createToastMessage({ type: TOAST_TYPE.INFO, message, options })
}

export { toast }

