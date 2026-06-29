import { describe, expect, it } from 'vitest'

import { buildFixture, readFuseIndex } from './helpers'

describe('output mode', () => {
  it('builds a fuse index from the generated HTML', async () => {
    const root = await buildFixture('output')
    const { index, list } = readFuseIndex(root)

    expect(index).toBeDefined()
    expect(list).toHaveLength(2)

    const byPath = Object.fromEntries(list.map((d) => [d.pathname, d]))

    expect(Object.keys(byPath).sort()).toEqual(['/', '/about/'])
    // frontmatter.title falls back to <meta og:title> then <h1>
    expect(byPath['/'].frontmatter.title).toBe('Home')
    expect(byPath['/about/'].frontmatter.title).toBe('About')
    // content is extracted from the `main` selector
    expect(byPath['/'].content).toContain('apples and bananas')
    expect(byPath['/about/'].content).toContain('cherries and dates')
  })
})
