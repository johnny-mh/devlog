import type { AstroConfig, AstroIntegration } from 'astro'
import Fuse from 'fuse.js'
import { debounce, map } from 'lodash-es'
import { createHmac } from 'node:crypto'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { Plugin } from 'vite'
import { getSearchable, getFileInfo, Searchable } from './util'

export { Searchable } from './util'

declare global {
  function loadFuse(
    options?: Omit<Fuse.IFuseOptions<Searchable>, 'keys'>
  ): Promise<Fuse<Searchable>>
}

const PLUGIN_NAME = 'astro-fuse'

export type AstroFuseConfig = {
  keys: Fuse.FuseOptionKey<Searchable>[],
  injectScript?: boolean
}
  & Fuse.FuseIndexOptions<Searchable>

export default function astroFuse(
  _config: AstroFuseConfig
): AstroIntegration {
  let outDir = ''

  return {
    name: PLUGIN_NAME,
    hooks: {
      'astro:config:setup': async ({ config, updateConfig, injectScript }) => {
        outDir = config.outDir.pathname

        if (_config.injectScript !== false) {
          injectScript(
            'head-inline',
            `window.addEventListener('fuseLoaded', function(e) {
  window.loadFuse = function loadFuse(options) {
    return new Promise(function(resolve, reject) {
        const Fuse = e.detail;

        fetch('/fuse.json')
          .then(res => res.json())
          .then(({list, index}) => {
            resolve(new Fuse(
              list,
              Object.assign(
                Object.assign({}, options),
                {keys: [${map(_config.keys, (key) => `'${key}'`)}]}
              ),
              Fuse.parseIndex(index)
            ))
          })
          .catch(reject)
    });
  };
});`
          )

          injectScript(
            'page',
            `import('fuse.js').then(mod => {
  window.dispatchEvent(new CustomEvent('fuseLoaded', {detail: mod.default}));
})`
          )
        }

        updateConfig({
          vite: {
            plugins: [fuse(config, _config)],
          },
        })
      },

      'astro:build:done': () => {
        if (existsSync(join(outDir, 'fuse.json'))) {
          console.log(
            `%s${PLUGIN_NAME}:%s \`fuse.json\` is created.`,
            '\x1b[32m',
            '\x1b[0m'
          )
        }
      },
    },
  }
}

function fuse(
  config: AstroConfig,
  _config: AstroFuseConfig,
): Plugin {
  const outDir = config.outDir.pathname
  const outputPath = join(outDir, 'fuse.json')

  if (!existsSync(outDir)) {
    mkdirSync(dirname(outputPath))
    writeFileSync(outputPath, '{}')
  }

  const result = new Map<string, [hash: string, searchable: Searchable]>()
  const buffer = new Map<string, [hash: string, searchable: Searchable]>()

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
        const list = map(Array.from(result.values()), 1)
        const index = Fuse.createIndex(_config.keys, list, _config)

        writeFile(outputPath, JSON.stringify({ list, index: index.toJSON() }))
      }
    },
    process.env.NODE_ENV === 'production' ? 0 : 500
  )

  return {
    name: PLUGIN_NAME,
    async transform(_, id) {
      if (!id.match(/\.mdx?/)) {
        return
      }

      const { fileId, fileUrl } = getFileInfo(id, config)
      const code = await readFile(fileId, 'utf-8')
      const hash = createHmac('sha256', code).digest('hex').substring(0, 8)
      const content = getSearchable(code)
      buffer.set(fileId, [hash, { ...content, fileUrl }])

      writeFuseIndex()
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.endsWith('/fuse.json')) {
          const file = await readFile(outputPath)

          return res.setHeader('Content-Type', 'application/json').end(file)
        }

        return next()
      })
    },
  }
}
