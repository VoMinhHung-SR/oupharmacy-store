import React, { forwardRef, useId } from 'react'

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  label?: string
  helperText?: React.ReactNode
  error?: boolean
  fullWidth?: boolean
  containerClassName?: string
  labelClassName?: string
  multiline?: boolean
  rows?: number
}

const classNames = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error = false,
      fullWidth = true,
      className,
      containerClassName,
      labelClassName,
      id,
      required,
      disabled,
      multiline = false,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const defaultId = useId()
    const inputId = id || defaultId

    const baseInputClasses = classNames(
      'peer w-full appearance-none rounded-lg border px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-1 transition-all duration-200 bg-transparent',
      'placeholder-transparent focus:placeholder-slate-400',
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500',
      disabled ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500' : 'bg-white',
      multiline ? 'block resize-none' : 'block',
      className
    )

    return (
      <div className={classNames('w-full', containerClassName)}>
        <div className="relative w-full">
          {multiline ? (
            <textarea
              id={inputId}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              disabled={disabled}
              required={required}
              rows={rows}
              placeholder={props.placeholder || ' '}
              className={baseInputClasses}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              id={inputId}
              ref={ref as React.Ref<HTMLInputElement>}
              disabled={disabled}
              required={required}
              placeholder={props.placeholder || ' '}
              className={baseInputClasses}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {label && (
            <label
              htmlFor={inputId}
              className={classNames(
                'absolute left-2.5 top-0 z-20 w-auto max-w-[calc(100%-24px)] origin-left -translate-y-1/2 truncate scale-75 transform cursor-text px-1 text-sm leading-none duration-200',
                'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100',
                'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75',
                disabled ? 'bg-slate-50 text-slate-400' : 'bg-white',
                error ? 'text-red-500 peer-focus:text-red-500' : 'text-slate-500 peer-focus:text-primary-600',
                labelClassName
              )}
            >
              {label} {required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
          )}
        </div>
        {helperText && (
          <p className={classNames('mt-1 text-xs', error ? 'text-red-500' : 'text-slate-500')}>{helperText}</p>
        )}
      </div>
    )
  }
)

TextField.displayName = 'TextField'

