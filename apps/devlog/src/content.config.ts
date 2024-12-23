import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const post = defineCollection({
  loader: glob({ base: './src/data/post', pattern: '**/[^_]*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      categories: z.string().array().min(1),
      cover: z.optional(image()),
      coverAlt: z.string().optional(),
      description: z.string().optional(),
      draft: z.boolean().optional(),
      publishedAt: z.string(),
      tags: z.string().array().optional(),
      title: z.string(),
      updatedAt: z.string().optional(),
    }),
})

export const collections = { post }
