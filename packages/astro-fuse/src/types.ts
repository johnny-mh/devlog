import type { Cheerio, CheerioAPI } from 'cheerio'
import type Fuse from 'fuse.js'

export type SourceBaseSearchable = {
  frontmatter: Record<string, any>
  content: string
  fileUrl: string
}

export type OutputBaseSearchable = {
  frontmatter: Record<string, any>
  content: string
  pathname: string
}

export type Searchable = SourceBaseSearchable | OutputBaseSearchable

export type SourceBaseAstroFuseConfig = {
  keys?: Fuse.FuseOptionKey<SourceBaseSearchable>[]
  basedOn?: 'source'
  injectScript?: boolean
} & Fuse.FuseIndexOptions<SourceBaseSearchable>

export type OutputBaseAstroFuseConfig = {
  keys?: Fuse.FuseOptionKey<OutputBaseSearchable>[]
  basedOn?: 'output'
  injectScript?: boolean
  filter?: (pathname: string) => boolean
  extractContentFromHTML?: string | (($: CheerioAPI) => Cheerio<any>)
  extractFrontmatterFromHTML?: ($: CheerioAPI, pathname: string) => any
} & Fuse.FuseIndexOptions<OutputBaseSearchable>

export type AstroFuseConfig =
  | OutputBaseAstroFuseConfig
  | SourceBaseAstroFuseConfig
