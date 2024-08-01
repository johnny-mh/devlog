import type { CollectionEntry } from 'astro:content'

export interface Frontmatter {
  categories: string[]
  cover?: { format: string; height: number; src: string; width: number }
  coverAlt?: string
  coverColors?: string[]
  draft?: boolean
  publishedAt: string
  readingTime: number
  summary: string
  tags: string[]
  title: string
  updatedAt: string
}

export type RenderedPostEntry = {
  rendered: {
    remarkPluginFrontmatter: Frontmatter
  } & Awaited<ReturnType<CollectionEntry<'post'>['render']>>
} & CollectionEntry<'post'>

export type CategoryEntry = {
  category: string
  count: number
  slug: string
}
