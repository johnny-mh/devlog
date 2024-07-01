import mdx from '@astrojs/mdx'
import partytown from '@astrojs/partytown'
import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import rehypeFigure from "@microflash/rehype-figure";
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight
} from '@shikijs/transformers'
import { defineConfig } from 'astro/config'
import fuse from 'astro-fuse'
import robotsTxt from 'astro-robots-txt'

import { remarkCreatedAt } from './remarks/createdAt.mjs'
import { remarkReadingTime } from './remarks/readingTime.mjs'

// https://astro.build/config
export default defineConfig({
  site: 'https://johnny-mh.github.io',
  integrations: [
    mdx(),
    preact(),
    sitemap(),
    robotsTxt({
      host: 'johnny-mh.github.io',
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/about',
            '/about/',
            '/archives',
            '/archives/',
            '/post/category/',
            '/post/tag/',
          ],
        },
      ],
    }),
    fuse({ keys: ['content', 'frontmatter.title', 'frontmatter.tags'] }),
    partytown({ config: { forward: ['dataLayer.push'] } }),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    extendDefaultPlugins: true,
    remarkPlugins: [remarkReadingTime, remarkCreatedAt],
    rehypePlugins: [rehypeFigure],
    shikiConfig: {
      theme: 'catppuccin-mocha',
      transformers: [transformerMetaHighlight(), transformerMetaWordHighlight()]
    }
  },
})
