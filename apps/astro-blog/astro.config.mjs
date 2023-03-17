import { defineConfig } from 'astro/config'
import image from '@astrojs/image'
import mdx from '@astrojs/mdx'
import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'
import fuse from 'astro-fuse'

import { remarkReadingTime } from './remarks/readingTime.mjs'
import { remarkCreatedAt } from './remarks/createdAt.mjs'
import { rehypePrettyCode } from './remarks/rehypePrettyCode.mjs'

// https://astro.build/config
export default defineConfig({
  site: 'http://johnny-mh.github.io/',
  integrations: [
    image({ serviceEntryPoint: '@astrojs/image/sharp' }),
    mdx(),
    preact(),
    sitemap(),
    robotsTxt(),
    fuse({ keys: ['content', 'frontmatter.title'] }),
  ],
  markdown: {
    syntaxHighlight: false,
    extendDefaultPlugins: true,
    remarkPlugins: [remarkReadingTime, remarkCreatedAt],
    rehypePlugins: [rehypePrettyCode],
  },
})
