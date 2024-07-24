export function shuffle<T>(array: T[]) {
  return array
    .map((value) => ({ sortKey: Math.random(), value }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ value }) => value)
}
