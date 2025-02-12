import React from 'react'
import clsx from 'clsx'

export function FieldGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(className, 'flex flex-col gap-2')} {...props} />
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={clsx(className)} {...props} />
}

export function Input({
  className,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={clsx(
        className,
        'shaddow-inner rounded bg-slate-50 px-2 py-1 shadow-slate-300 dark:bg-slate-600 dark:shadow-slate-700',
        invalid ? 'border-2 border-rose-600' : '',
      )}
      {...props}
    />
  )
}

const MIN_TEXTAREA_HEIGHT = 32

export function TextArea({
  className,
  invalid,
  autoResize,
  onChange,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean
  autoResize?: boolean
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const [value, setValue] = React.useState('')
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
    onChange?.(event)
  }

  React.useLayoutEffect(() => {
    if (!autoResize) return
    if (!textareaRef.current) return
    // Reset height - important to shrink on delete
    textareaRef.current.style.height = 'inherit'
    // Set height
    textareaRef.current.style.height = `${Math.max(
      textareaRef.current.scrollHeight,
      MIN_TEXTAREA_HEIGHT,
    )}px`
  }, [value, autoResize])

  return (
    <textarea
      {...props}
      ref={textareaRef}
      className={clsx(
        className,
        'shaddow-inner rounded bg-slate-50 px-2 py-1 shadow-slate-300 dark:bg-slate-600 dark:shadow-slate-700',
      )}
      onChange={handleChange}
    />
  )
}

export function Issues({
  className,
  issues,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { issues?: string[] }) {
  if (!issues) return null
  return (
    <>
      {issues.map((issue, i) => (
        <p key={i + issue} className={clsx(className, 'text-rose-600')}>
          {issue}
        </p>
      ))}
    </>
  )
}
