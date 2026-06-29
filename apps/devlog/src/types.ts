export interface Frontmatter {
  readingTime: number
  summary: string
  title: string
}

export type CategoryEntry = {
  category: string
  count: number
  slug: string
}
