import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Fixtures import the integration from `dist/`, so build the package once
 * before the suite runs. Keeps `pnpm --filter astro-fuse test` self-contained.
 */
export default function setup() {
  const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  execSync('pnpm build', { cwd: pkgRoot, stdio: 'inherit' })
}
