import type { AstroConfig, AstroIntegration } from 'astro'
import type { Plugin } from 'vite'

import * as cheerio from 'cheerio'
import Fuse, { FuseOptionKey } from 'fuse.js'
import { convert } from 'html-to-text'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

import { PLUGIN_NAME } from './index'
import {
  OutputBaseAstroFuseOptions,
  OutputBaseSearchable,
  Searchable,
} from './types'

export function basedOnOutput({
  config,
  filename,
}: {
  config: AstroConfig
  filename: string
}): Plugin {
  const outDir = config.outDir.pathname
  const outputPath = join(outDir, filename)

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
  }
}

type AstroBuildDoneEvent = Parameters<
  NonNullable<AstroIntegration['hooks']['astro:build:done']>
>[0]

export function writeFuseIndex({
  buildDoneEvent,
  config,
  filename,
  keys,
  options,
}: {
  buildDoneEvent: AstroBuildDoneEvent
  config: AstroConfig
  filename: string
  keys: FuseOptionKey<Searchable>[]
  options?: OutputBaseAstroFuseOptions
}) {
  const { logger, pages, routes } = buildDoneEvent
  let finalSiteBasePath: string

  if (config.site) {
    finalSiteBasePath = new URL(config.base, config.site).pathname
  } else {
    console.warn(
      'The astro-fuse integration requires the `site` astro.config option when source mode. Skipping.'
    )
    return
  }

  let pagePaths = pages.map(({ pathname }) => {
    if (pathname !== '' && !finalSiteBasePath.endsWith('/')) {
      finalSiteBasePath += '/'
    }

    return finalSiteBasePath + pathname
  })

  const routePaths = routes.reduce<string[]>((urls, r) => {
    if (r.type !== 'page') {
      return urls
    }

    /**
     * Dynamic URLs have entries with `undefined` pathnames
     */
    if (r.pathname) {
      if (isStatusCodePage(r.pathname ?? r.route)) {
        return urls
      }

      /**
       * remove the initial slash from relative pathname
       * because `finalSiteUrl` always has trailing slash
       */
      const path = finalSiteBasePath + r.generate(r.pathname).substring(1)

      if (config.trailingSlash === 'never') {
        urls.push(path)
      } else if (config.build.format === 'directory' && !path.endsWith('/')) {
        urls.push(`${path}/`)
      } else {
        urls.push(path)
      }
    }

    return urls
  }, [])

  pagePaths = Array.from(new Set([...pagePaths, ...routePaths]))

  try {
    if (options?.filter) {
      pagePaths = pagePaths.filter(options.filter)
    }
  } catch (err) {
    logger.error(`Error filtering pages\n${String(err)}`)
    return
  }

  if (pagePaths.length === 0) {
    logger.warn(`No pages found!\n\`${filename}\` not created.`)
    return
  }

  const outDir = config.outDir.pathname
  const outputPath = join(outDir, filename)

  if (!existsSync(outDir)) {
    mkdirSync(dirname(outputPath))
  }

  const list: OutputBaseSearchable[] = []

  for (const path of pagePaths) {
    const filePath = path.endsWith('/') ? `${path}index.html` : `${path}.html`

    let content = ''

    try {
      content = readFileSync(join(config.outDir.pathname, filePath), {
        encoding: 'utf8',
      }).toString()
    } catch (err) {
      logger.warn(`Skipped!\nNo output found! ${filePath}`)

      continue
    }

    const $ = cheerio.load(content)

    if (options?.extractContentFromHTML) {
      if (typeof options.extractContentFromHTML === 'string') {
        content = $(options.extractContentFromHTML).html() ?? ''
      } else {
        content = options.extractContentFromHTML($).html() ?? ''
      }
    }

    if (!content) {
      logger.warn(`Skipped!\nNo content! ${filePath}`)
      continue
    }

    let frontmatter: Record<string, string> = {}

    if (options?.extractFrontmatterFromHTML) {
      frontmatter = options.extractFrontmatterFromHTML($, path)
    } else {
      let title = $('meta[property="og:title"]').first().text()

      if (!title) {
        title = $('h1').first().text()
      }

      frontmatter = { title }
    }

    list.push({ content: convert(content), frontmatter, pathname: path })
  }

  const index = Fuse.createIndex(
    keys,
    list,
    options?.getFn ? { getFn: options.getFn } : undefined
  )

  writeFileSync(outputPath, JSON.stringify({ index: index.toJSON(), list }))

  logger.info(
    `\`${filename}\` created at \`${relative(process.cwd(), dirname(outputPath))}\``
  )
}

const STATUS_CODE_PAGES = new Set(['404', '500'])

function isStatusCodePage(pathname: string): boolean {
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }
  const end = pathname.split('/').pop() ?? ''
  return STATUS_CODE_PAGES.has(end)
}
