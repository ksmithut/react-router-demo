import type { BaseIssue } from 'valibot'

function groupBy<TValue, TKey, TNewValue = TValue>(
  array: TValue[],
  getKey: (item: TValue) => TKey,
  getValue?: (item: TValue) => TNewValue,
) {
  return array.reduce(
    (map, item) => {
      const key = getKey(item)
      const value = getValue ? getValue(item) : (item as unknown as TNewValue)
      const items = map.get(key) ?? []
      items.push(value)
      return map.set(key, items)
    },
    new Map() as Map<TKey, TNewValue[]>,
  )
}

export function issuesToPathMap(issues: BaseIssue<any>[]) {
  return groupBy(
    issues,
    (issue) => issue.path?.map((part) => part.key).join('.') ?? '',
    (issue) => issue.message,
  )
}

export function createIssues(path: string, issues: string[]) {
  return new Map([[path, issues]])
}
