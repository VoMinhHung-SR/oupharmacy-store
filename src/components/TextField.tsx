import React, { forwardRef, useId } from 'react'

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ')

export type TextFieldVariant = 'floating' | 'outline'

export interface TextFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
  'size'
> {
  variant?: TextFieldVariant
  /** Nhãn trên viền (outline). Nếu bỏ trống, `outline` lấy từ `placeholder`. */
  label?: string
  /** `above` = nhãn tách khỏi viền (vd. ghi chú dài). Mặc định = nhãn nằm trên border. */
  labelPosition?: 'above' | 'border'
  helperText?: React.ReactNode
  error?: boolean
  fullWidth?: boolean
  containerClassName?: string
  labelClassName?: string
  multiline?: boolean
  rows?: number
}

export interface SelectFieldProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> {
  variant?: TextFieldVariant
  label?: string
  /** `none` = select kiểu cũ (chỉ text trong option, không nhãn trên viền). */
  labelPosition?: 'above' | 'border' | 'none'
  helperText?: React.ReactNode
  error?: boolean
  fullWidth?: boolean
  containerClassName?: string
  labelClassName?: string
  placeholderOption?: boolean
}

function plainSelectClasses(error: boolean, disabled?: boolean, isEmpty?: boolean, extra?: string) {
  return cn(
    'w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-900 transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    error ? 'border-red-300 focus:ring-red-500' : 'border-slate-200',
    isEmpty && 'text-slate-400',
    disabled && 'cursor-not-allowed bg-slate-50 text-slate-500',
    extra
  )
}

function FieldHelper({ helperText, error }: { helperText?: React.ReactNode; error?: boolean }) {
  if (!helperText) return null
  return <p className={cn('mt-1.5 text-xs', error ? 'text-red-600' : 'text-slate-500')}>{helperText}</p>
}

/** Nhãn nằm trên viền outline (MUI Outlined). */
function OutlineBorderLabel({
  inputId,
  label,
  required,
  error,
  disabled,
  labelClassName,
  alwaysShrink = false,
}: {
  inputId: string
  label: string
  required?: boolean
  error?: boolean
  disabled?: boolean
  labelClassName?: string
  /** Select: luôn thu nhỏ trên viền. */
  alwaysShrink?: boolean
}) {
  return (
    <label
      htmlFor={inputId}
      className={cn(
        'pointer-events-none absolute left-3 z-20 max-w-[calc(100%-1.25rem)] origin-left cursor-text whitespace-nowrap bg-white px-1 text-sm leading-tight duration-200',
        alwaysShrink
          ? 'top-0 -translate-y-1/2 scale-[0.85] text-slate-500'
          : cn(
              'top-1/2 -translate-y-1/2 scale-100 text-slate-400',
              'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-[0.85] peer-focus:text-primary-600',
              'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:text-slate-600'
            ),
        disabled && 'bg-slate-50 text-slate-400',
        error && 'text-red-500 peer-focus:text-red-500',
        !error && !alwaysShrink && 'peer-focus:text-primary-600',
        labelClassName
      )}
    >
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
  )
}

function AboveLabel({
  inputId,
  label,
  required,
  labelClassName,
}: {
  inputId: string
  label: string
  required?: boolean
  labelClassName?: string
}) {
  return (
    <label htmlFor={inputId} className={cn('mb-1.5 block text-xs font-medium text-slate-600', labelClassName)}>
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  )
}

function outlineInputClasses(
  error: boolean,
  disabled?: boolean,
  multiline?: boolean,
  visiblePlaceholder?: boolean,
  extra?: string
) {
  return cn(
    'peer relative z-0 w-full appearance-none rounded-lg border bg-white px-3.5 pb-2.5 text-sm text-slate-900 transition-all duration-200',
    multiline && visiblePlaceholder ? 'pt-5' : 'pt-4',
    visiblePlaceholder ? 'placeholder:text-slate-400' : 'placeholder-transparent',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    error ? 'border-red-300 focus:ring-red-500' : 'border-slate-200',
    disabled && 'cursor-not-allowed bg-slate-50 text-slate-500',
    multiline && 'resize-none',
    extra
  )
}

function floatingInputClasses(error: boolean, disabled?: boolean, multiline?: boolean, extra?: string) {
  return cn(
    'peer w-full appearance-none rounded-lg border px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-1 transition-all duration-200 bg-transparent',
    'placeholder-transparent focus:placeholder-slate-400',
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500',
    disabled ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500' : 'bg-white',
    multiline ? 'block resize-none' : 'block',
    extra
  )
}

export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  (
    {
      variant = 'floating',
      label,
      labelPosition = 'border',
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
      placeholder,
      ...props
    },
    ref
  ) => {
    const defaultId = useId()
    const inputId = id || defaultId
    const isOutline = variant === 'outline'
    const showAboveLabel = isOutline && labelPosition === 'above' && (label || placeholder)
    const borderLabel =
      isOutline && !showAboveLabel ? (label || placeholder || undefined) : label || undefined
    const hasLabelAndPlaceholder = Boolean(isOutline && label && placeholder)
    const outlineLabelOnBorder = Boolean(isOutline && borderLabel && !showAboveLabel)

    const inputClasses = isOutline
      ? outlineInputClasses(error, disabled, multiline, hasLabelAndPlaceholder, className)
      : floatingInputClasses(error, disabled, multiline, className)

    const inputPlaceholder = hasLabelAndPlaceholder
      ? placeholder
      : isOutline && borderLabel
        ? ' '
        : placeholder || ' '

    return (
      <div className={cn(fullWidth && 'w-full', containerClassName)}>
        {showAboveLabel && (
          <AboveLabel
            inputId={inputId}
            label={label || placeholder || ''}
            required={required}
            labelClassName={labelClassName}
          />
        )}
        <div
          className={cn(
            'relative w-full',
            outlineLabelOnBorder && multiline && hasLabelAndPlaceholder && 'isolate'
          )}
        >
          {multiline ? (
            <textarea
              id={inputId}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              disabled={disabled}
              required={required}
              rows={rows}
              placeholder={inputPlaceholder}
              className={inputClasses}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              id={inputId}
              ref={ref as React.Ref<HTMLInputElement>}
              disabled={disabled}
              required={required}
              placeholder={inputPlaceholder}
              className={inputClasses}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {outlineLabelOnBorder && (
            <OutlineBorderLabel
              inputId={inputId}
              label={label || borderLabel}
              required={required}
              error={error}
              disabled={disabled}
              labelClassName={labelClassName}
              alwaysShrink={outlineLabelOnBorder}
            />
          )}
          {!isOutline && label && (
            <label
              htmlFor={inputId}
              className={cn(
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
        <FieldHelper helperText={helperText} error={error} />
      </div>
    )
  }
)

TextField.displayName = 'TextField'

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      variant = 'outline',
      label,
      labelPosition = 'none',
      helperText,
      error = false,
      fullWidth = true,
      containerClassName,
      labelClassName,
      className,
      id,
      required,
      disabled,
      placeholderOption = true,
      children,
      value,
      ...props
    },
    ref
  ) => {
    const defaultId = useId()
    const inputId = id || defaultId
    const isEmpty = value === '' || value === undefined || value === null
    const usePlainSelect = labelPosition === 'none'
    const showAboveLabel = labelPosition === 'above' && label
    const showBorderLabel = labelPosition === 'border' && label

    const selectClasses = usePlainSelect
      ? plainSelectClasses(error, disabled, placeholderOption && isEmpty, className)
      : outlineInputClasses(error, disabled, false, false, className)

    return (
      <div className={cn(fullWidth && 'w-full', containerClassName)}>
        {showAboveLabel && label && (
          <AboveLabel inputId={inputId} label={label} required={required} labelClassName={labelClassName} />
        )}
        <div className="relative w-full">
          <select
            id={inputId}
            ref={ref}
            disabled={disabled}
            required={required}
            value={value}
            className={selectClasses}
            aria-label={label}
            {...props}
          >
            {children}
          </select>
          {showBorderLabel && (
            <OutlineBorderLabel
              inputId={inputId}
              label={label}
              required={required}
              error={error}
              disabled={disabled}
              labelClassName={labelClassName}
              alwaysShrink
            />
          )}
        </div>
        <FieldHelper helperText={helperText} error={error} />
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'
