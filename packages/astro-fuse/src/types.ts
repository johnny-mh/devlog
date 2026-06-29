/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Cheerio, CheerioAPI } from 'cheerio'
import type { FuseIndexOptions } from 'fuse.js'

export type OutputBaseSearchable = {
  content: string
  frontmatter: Record<string, any>
  pathname: string
}

export type Searchable = OutputBaseSearchable

export type BaseAstroFuseOptions = {
  filename?: string
  filter?: (pathname: string) => boolean
}

export type OutputBaseAstroFuseOptions = {
  extractContentFromHTML?: (($: CheerioAPI) => Cheerio<any>) | string
  extractFrontmatterFromHTML?: ($: CheerioAPI, pathname: string) => any
} & BaseAstroFuseOptions &
  Partial<FuseIndexOptions<OutputBaseSearchable>>

export type AstroFuseOptions = OutputBaseAstroFuseOptions
