import clsx from 'clsx'

export function Button({
  className,
  style = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  style?: 'primary' | 'danger'
}) {
  return (
    <button
      className={clsx(
        className,
        'cursor-pointer rounded px-3 py-2',
        style === 'primary' && 'bg-sky-600 text-white',
        style === 'danger' && 'bg-rose-700 text-white',
      )}
      {...props}
    />
  )
}
