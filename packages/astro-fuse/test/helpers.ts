import { build } from 'astro'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { OutputBaseSearchable } from '../src/types'

/** Run a real `astro build` on a fixture and return its root directory. */
export async function buildFixture(name: string): Promise<string> {
  const root = fileURLToPath(new URL(`./fixtures/${name}/`, import.meta.url))

  await build({ logLevel: 'error', root })

  return root
}

/** Read and parse the `fuse.json` produced inside a fixture's `dist`. */
export function readFuseIndex(root: string, filename = 'fuse.json') {
  return JSON.parse(readFileSync(join(root, 'dist', filename), 'utf8')) as {
    index: unknown
    list: OutputBaseSearchable[]
  }
}
