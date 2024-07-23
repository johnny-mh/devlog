import mdx from '@astrojs/mdx'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import rehypeFigure from '@microflash/rehype-figure'
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from '@shikijs/transformers'
import fuse from 'astro-fuse'
import robotsTxt from 'astro-robots-txt'
import { defineConfig } from 'astro/config'

import { remarkCreatedAt } from './remarks/createdAt.mjs'
import { remarkReadingTime } from './remarks/readingTime.mjs'

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    react(),
    sitemap(),
    robotsTxt({
      host: 'johnny-mh.github.io',
      policy: [
        {
          allow: '/',
          disallow: [
            '/about',
            '/about/',
            '/archives',
            '/archives/',
            '/post/category/',
            '/post/tag/',
          ],
          userAgent: '*',
        },
      ],
    }),
    fuse(['content', 'frontmatter.title', 'frontmatter.tags'], {
      extractContentFromHTML: '.markdown-content',
      extractFrontmatterFromHTML: ($) => {
        const el = $('[data-frontmatter]')

        if (el.length) {
          return JSON.parse(el.first().val())
        }

        return { title: $('h1').first().text() }
      },
      filter: (path) => /^\/post\/[^/]+\/$/.test(path),
    }),
    partytown({ config: { forward: ['dataLayer.push'] } }),
  ],
  markdown: {
    extendDefaultPlugins: true,
    rehypePlugins: [rehypeFigure],
    remarkPlugins: [remarkReadingTime, remarkCreatedAt],
    shikiConfig: {
      theme: 'catppuccin-mocha',
      transformers: [
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
      ],
    },
    syntaxHighlight: 'shiki',
  },
  site: 'https://johnny-mh.github.io',
})
