export function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  if (typeof value !== 'string') throw new TypeError(`${key} was not a string`)
  return value
}
