import type { AstroConfig, AstroIntegration } from 'astro'
import type { FuseOptionKey } from 'fuse.js'

import type { AstroFuseOptions, Searchable } from './types'

import {
  basedOnOutput,
  type ResolvedRouteLike,
  writeFuseIndex,
} from './basedOnOutput'

export { AstroFuseOptions, OutputBaseSearchable, Searchable } from './types'

export const PLUGIN_NAME = 'astro-fuse'

export default function astroFuse(
  keys: FuseOptionKey<Searchable>[],
  options?: AstroFuseOptions
): AstroIntegration {
  // `basedOn: 'source'` was removed in v2. It relied on Vite's `transform`
  // hook firing for content files, which no longer happens with Astro 5's
  // Content Layer. Output mode is now the only mode.
  if ((options as { basedOn?: string } | undefined)?.basedOn === 'source') {
    throw new Error(
      "[astro-fuse] `basedOn: 'source'` was removed in v2 and no longer works on Astro 5+. Remove the `basedOn` option to use output mode."
    )
  }

  let config: AstroConfig
  let resolvedRoutes: ResolvedRouteLike[] = []

  const _keys = keys ?? ['content']
  const filename = options?.filename ?? 'fuse.json'

  return {
    hooks: {
      'astro:build:done': (buildDoneEvent) => {
        writeFuseIndex({
          buildDoneEvent,
          config,
          filename,
          keys: _keys,
          options,
          routes: resolvedRoutes,
        })
      },

      'astro:config:done': ({ config: cfg }) => {
        config = cfg
      },

      'astro:config:setup': ({ config, updateConfig }) => {
        updateConfig({
          // The Vite plugin type comes from a different `vite` resolution
          // than Astro's bundled one, so cast to Astro's config shape.
          vite: {
            plugins: [basedOnOutput({ config, filename })],
          },
        } as Parameters<typeof updateConfig>[0])
      },

      'astro:routes:resolved': ({ routes }) => {
        resolvedRoutes = routes
      },
    },
    name: PLUGIN_NAME,
  }
}
