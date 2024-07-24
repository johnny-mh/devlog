/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Cheerio, CheerioAPI } from 'cheerio'
import type { FuseIndexOptions } from 'fuse.js'

export type SourceBaseSearchable = {
  content: string
  fileUrl: string
  frontmatter: Record<string, any>
}

export type OutputBaseSearchable = {
  content: string
  frontmatter: Record<string, any>
  pathname: string
}

export type Searchable = OutputBaseSearchable | SourceBaseSearchable

export type BaseAstroFuseOptions = {
  filename?: string
  filter?: (pathname: string) => boolean
}

export type SourceBaseAstroFuseOptions = {
  basedOn?: 'source'
} & BaseAstroFuseOptions &
  Partial<FuseIndexOptions<SourceBaseSearchable>>

export type OutputBaseAstroFuseOptions = {
  basedOn?: 'output'
  extractContentFromHTML?: (($: CheerioAPI) => Cheerio<any>) | string
  extractFrontmatterFromHTML?: ($: CheerioAPI, pathname: string) => any
} & BaseAstroFuseOptions &
  Partial<FuseIndexOptions<OutputBaseSearchable>>

export type AstroFuseOptions =
  | OutputBaseAstroFuseOptions
  | SourceBaseAstroFuseOptions
