import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

import * as cheerio from 'cheerio'
import Fuse from 'fuse.js'
import { convert } from 'html-to-text'
import { isEmpty, map, uniq } from 'lodash-es'

import { OutputBaseAstroFuseConfig, OutputBaseSearchable } from './types'
import { log } from './util'

import type { AstroConfig, AstroIntegration } from 'astro'
import type { Plugin } from 'vite'

import { OUTFILE, PLUGIN_NAME } from './index'

export function basedOnOutput(config: AstroConfig): Plugin {
  const outDir = config.outDir.pathname
  const outputPath = join(outDir, OUTFILE)

  return {
    name: PLUGIN_NAME,
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.endsWith(`/${OUTFILE}`)) {
          const file = await readFile(outputPath)

          return res.setHeader('Content-Type', 'application/json').end(file)
        }

        return next()
      })
    },
  }
}

type AstroBuildDoneEvent = Parameters<
  NonNullable<AstroIntegration['hooks']['astro:build:done']>
>[0]

export function writeFuseIndex(
  config: AstroConfig,
  _config: OutputBaseAstroFuseConfig,
  opts: AstroBuildDoneEvent
) {
  const { routes, pages } = opts
  let finalSiteBasePath: string
  if (config.site) {
    finalSiteBasePath = new URL(config.base, config.site).pathname
  } else {
    console.warn(
      'The astro-fuse integration requires the `site` astro.config option when source mode. Skipping.'
    )
    return
  }

  let pagePaths = map(pages, ({ pathname }) => {
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
    if (_config.filter) {
      pagePaths = pagePaths.filter(_config.filter)
    }
  } catch (err) {
    log(`Error filtering pages\n${String(err)}`, 'error')
    return
  }

  if (pagePaths.length === 0) {
    log(`No pages found!\n\`${OUTFILE}\` not created.`, 'warn')
    return
  }

  const outDir = config.outDir.pathname
  const outputPath = join(outDir, OUTFILE)

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
      log(`Skipped!\nNo output found! ${filePath}`, 'warn')
      continue
    }

    const $ = cheerio.load(content)

    if (_config.extractContentFromHTML) {
      if (typeof _config.extractContentFromHTML === 'string') {
        content = $(_config.extractContentFromHTML).html() ?? ''
      } else {
        content = _config.extractContentFromHTML($).html() ?? ''
      }
    }

    if (isEmpty(content)) {
      log(`Skipped!\nNo content! ${filePath}`, 'warn')
      continue
    }

    let frontmatter: Record<string, string> = {}

    if (_config.extractFrontmatterFromHTML) {
      frontmatter = _config.extractFrontmatterFromHTML($, path)
    } else {
      let title = $('meta[property="og:title"]').first().text()

      if (!title) {
        title = $('h1').first().text()
      }

      frontmatter = { title }
    }

    list.push({ pathname: path, content: convert(content), frontmatter })
  }

  const _keys = uniq(['content', ...(_config?.keys ?? [])])
  const index = Fuse.createIndex(_keys, list, _config?.getFn ? { getFn: _config.getFn } : undefined)

  writeFileSync(outputPath, JSON.stringify({ list, index: index.toJSON() }))

  log(`\`${OUTFILE}\` created at \`${relative(process.cwd(), dirname(outputPath))}\``)
}

const STATUS_CODE_PAGES = new Set(['404', '500'])

function isStatusCodePage(pathname: string): boolean {
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }
  const end = pathname.split('/').pop() ?? ''
  return STATUS_CODE_PAGES.has(end)
}
