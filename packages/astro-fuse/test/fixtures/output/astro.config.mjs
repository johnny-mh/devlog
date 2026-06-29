import { defineConfig } from 'astro/config'

import fuse from '../../../dist/index.mjs'

// https://astro.build/config
export default defineConfig({
  integrations: [
    fuse(['content', 'frontmatter.title'], {
      extractContentFromHTML: 'main',
    }),
  ],
  site: 'https://example.com',
})
