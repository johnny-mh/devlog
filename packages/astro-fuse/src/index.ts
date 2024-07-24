import type { AstroConfig, AstroIntegration } from 'astro'
import type { FuseOptionKey } from 'fuse.js'

import { existsSync } from 'node:fs'
import { join, relative } from 'node:path'

import type {
  AstroFuseOptions,
  OutputBaseAstroFuseOptions,
  Searchable,
  SourceBaseAstroFuseOptions,
} from './types'

import { basedOnOutput, writeFuseIndex } from './basedOnOutput'
import { basedOnSource } from './basedOnSource'

export {
  AstroFuseOptions,
  OutputBaseAstroFuseOptions,
  OutputBaseSearchable,
  Searchable,
  SourceBaseAstroFuseOptions,
  SourceBaseSearchable,
} from './types'

export const PLUGIN_NAME = 'astro-fuse'

export default function astroFuse(
  keys: FuseOptionKey<Searchable>[],
  options?: AstroFuseOptions
): AstroIntegration {
  let config: AstroConfig
  let outDir = ''

  const _keys = keys ?? ['content']
  const basedOn = options?.basedOn ?? 'output'
  const filename = options?.filename ?? 'fuse.json'

  return {
    hooks: {
      'astro:build:done': (buildDoneEvent) => {
        if (basedOn === 'source') {
          if (existsSync(join(outDir, filename))) {
            buildDoneEvent.logger.info(
              `\`${filename}\` created at \`${relative(process.cwd(), outDir)}\``
            )
          }

          return
        }

        if (basedOn !== 'output') {
          return
        }

        writeFuseIndex({
          buildDoneEvent,
          config,
          filename,
          keys: _keys,
          options: options as OutputBaseAstroFuseOptions,
        })
      },

      'astro:config:done': ({ config: cfg }) => {
        config = cfg
      },

      'astro:config:setup': ({ config, updateConfig }) => {
        outDir = config.outDir.pathname

        if (basedOn === 'source') {
          updateConfig({
            vite: {
              plugins: [
                basedOnSource({
                  config,
                  filename,
                  keys: _keys,
                  options: options as SourceBaseAstroFuseOptions,
                }),
              ],
            },
          })
        } else if (basedOn === 'output') {
          updateConfig({
            vite: {
              plugins: [basedOnOutput({ config, filename })],
            },
          })
        }
      },
    },
    name: PLUGIN_NAME,
  }
}
