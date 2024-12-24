export interface Frontmatter {
  coverColors?: string[]
  readingTime: number
  summary: string
  title: string
}

export type CategoryEntry = {
  category: string
  count: number
  slug: string
}
