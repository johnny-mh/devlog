import { existsSync } from 'node:fs'
import { join, relative } from 'node:path'

import Fuse from 'fuse.js'
import { map, uniq } from 'lodash-es'

import { basedOnOutput, writeFuseIndex } from './basedOnOutput'
import { basedOnSource } from './basedOnSource'
import {
  Searchable,
  AstroFuseConfig,
  OutputBaseAstroFuseConfig,
  SourceBaseAstroFuseConfig,
} from './types'
import { log } from './util'

import type { AstroConfig, AstroIntegration } from 'astro'

export {
  Searchable,
  SourceBaseSearchable,
  OutputBaseAstroFuseConfig,
} from './types'

declare global {
  function loadFuse<TSearchable = Searchable>(
    options?: Omit<Fuse.IFuseOptions<TSearchable>, 'keys'>
  ): Promise<Fuse<TSearchable>>
}

export const PLUGIN_NAME = 'astro-fuse'
export const OUTFILE = 'fuse.json'

export default function astroFuse(_config?: AstroFuseConfig): AstroIntegration {
  let config: AstroConfig
  let outDir = ''

  const _basedOn = _config?.basedOn ?? 'source'
  const _injectScript = _config?.injectScript ?? true
  const _keys = uniq(['content', ...(_config?.keys ?? [])])

  return {
    name: PLUGIN_NAME,
    hooks: {
      'astro:config:setup': ({ config, updateConfig, injectScript }) => {
        outDir = config.outDir.pathname

        if (_injectScript !== false) {
          injectScript(
            'head-inline',
            `window.addEventListener('fuseLoaded', function(e) {
  window.loadFuse = function loadFuse(options) {
    return new Promise(function(resolve, reject) {
        const Fuse = e.detail;

        fetch('/${OUTFILE}')
          .then(res => res.json())
          .then(({list, index}) => {
            resolve(new Fuse(
              list,
              Object.assign(
                Object.assign({}, options),
                {keys: [${map(_keys, (key) => `'${key}'`)}]}
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

        if (_basedOn === 'source') {
          updateConfig({
            vite: {
              plugins: [
                basedOnSource(config, _config as SourceBaseAstroFuseConfig),
              ],
            },
          })
        } else if (_basedOn === 'output') {
          updateConfig({
            vite: {
              plugins: [basedOnOutput(config)],
            },
          })
        }
      },

      'astro:config:done': ({ config: cfg }) => {
        config = cfg
      },

      'astro:build:done': (opts) => {
        if (_basedOn === 'source') {
          if (existsSync(join(outDir, OUTFILE))) {
            log(`\`${OUTFILE}\` created at \`${relative(process.cwd(), outDir)}\``)
          }

          return
        }

        if (_basedOn !== 'output') {
          return
        }

        writeFuseIndex(config, _config as OutputBaseAstroFuseConfig, opts)
      },
    },
  }
}
