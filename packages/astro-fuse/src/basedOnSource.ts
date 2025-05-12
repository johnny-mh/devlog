import type { Plugin } from 'vite'

import { AstroConfig } from 'astro'
import Fuse, { type FuseOptionKey } from 'fuse.js'
import { load } from 'js-yaml'
import debounce from 'lodash.debounce'
import { createHmac } from 'node:crypto'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import { PLUGIN_NAME } from './index'
import {
  Searchable,
  SourceBaseAstroFuseOptions,
  SourceBaseSearchable,
} from './types'

export function basedOnSource({
  config,
  filename,
  keys,
  options,
}: {
  config: AstroConfig
  filename: string
  keys: FuseOptionKey<Searchable>[]
  options?: SourceBaseAstroFuseOptions
}): Plugin {
  const outDir = config.outDir.pathname
  const outputPath = join(outDir, filename)

  if (!existsSync(outDir)) {
    mkdirSync(dirname(outputPath))
    writeFileSync(outputPath, '{}')
  }

  const result = new Map<
    string,
    [hash: string, searchable: SourceBaseSearchable]
  >()
  const buffer = new Map<
    string,
    [hash: string, searchable: SourceBaseSearchable]
  >()

  const writeFuseIndex = debounce(
    () => {
      let diff = false

      buffer.forEach(([hash, searchable], fileId) => {
        const doc = result.get(fileId)

        if (!doc || doc[0] !== hash) {
          diff = true

          result.set(fileId, [hash, searchable])
        }
      })

      if (diff) {
        const list = Array.from(result.values()).map(
          ([, searchable]) => searchable
        )
        const index = Fuse.createIndex(
          keys,
          list,
          options?.getFn ? { getFn: options.getFn } : undefined
        )

        writeFile(outputPath, JSON.stringify({ index: index.toJSON(), list }))
      }
    },
    process.env.NODE_ENV === 'production' ? 0 : 500
  )

  return {
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.endsWith(`/${filename}`)) {
          const file = await readFile(outputPath)

          return res.setHeader('Content-Type', 'application/json').end(file)
        }

        return next()
      })
    },
    name: PLUGIN_NAME,

    async transform(_, id) {
      if (!id.match(/\.mdx?/)) {
        return
      }

      const path = `/${id.replace(new RegExp(`^${config.root.pathname}`), '')}`

      if (!path.startsWith('/src/content')) {
        return
      }

      if (options?.filter?.(path) === false) {
        return
      }

      const { fileId, fileUrl } = getFileInfo(id, config)
      const content = await readFile(fileId, 'utf-8')
      const hash = createHmac('sha256', content).digest('hex').substring(0, 8)
      const frontmatter = getFrontmatter(content)

      buffer.set(fileId, [hash, { content, fileUrl, frontmatter }])

      writeFuseIndex()
    },
  }
}

interface FileInfo {
  fileId: string
  fileUrl: string
}

function appendForwardSlash(path: string) {
  return path.endsWith('/') ? path : `${path}/`
}

export function getFileInfo(id: string, config: AstroConfig): FileInfo {
  const sitePathname = appendForwardSlash(
    config.site ? new URL(config.base, config.site).pathname : config.base
  )

  // Try to grab the file's actual URL
  let url: undefined | URL
  try {
    url = new URL(`file://${id}`)
    // eslint-disable-next-line no-empty
  } catch {}

  const fileId = id.split('?')[0]
  let fileUrl: string
  const isPage = fileId.includes('/pages/')
  if (isPage) {
    fileUrl = fileId
      .replace(/^.*?\/pages\//, sitePathname)
      .replace(/(\/index)?\.mdx$/, '')
  } else if (url && url.pathname.startsWith(config.root.pathname)) {
    fileUrl = url.pathname.slice(config.root.pathname.length)
  } else {
    fileUrl = fileId
  }

  if (fileUrl && config.trailingSlash === 'always') {
    fileUrl = appendForwardSlash(fileUrl)
  }
  return { fileId, fileUrl }
}

const FRONTMATTER_REGEX = /^---\s*([\s\S]*?)\s*---/

export function getFrontmatter(source: string): Record<string, string> {
  const match = FRONTMATTER_REGEX.exec(source)

  if (!match) {
    return {}
  }

  const [, value] = match

  if (!value) {
    return {}
  }

  return load(value) as Record<string, string>
}
