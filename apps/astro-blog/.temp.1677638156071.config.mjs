import { defineConfig } from 'astro/config'
import image from '@astrojs/image'
import mdx from '@astrojs/mdx'
import { remarkReadingTime } from './remarks/readingTime.mjs'
import { remarkCreatedAt } from './remarks/createdAt.mjs'

// https://astro.build/config
export default defineConfig({
  integrations: [
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkCreatedAt],
    extendDefaultPlugins: true,
    syntaxHighlight: 'prism',
  },
})
