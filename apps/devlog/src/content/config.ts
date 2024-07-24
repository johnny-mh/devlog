import { defineCollection, z } from 'astro:content'

const postCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      categories: z.string().array().min(1),
      cover: z.optional(image()),
      coverAlt: z.string().optional(),
      coverColors: z.string().array().optional(),
      draft: z.boolean().optional(),
      publishedAt: z.string(),
      readingTime: z.number().optional(),
      summary: z.string().optional(),
      tags: z.string().array().optional(),
      title: z.string(),
      updatedAt: z.string().optional(),
    }),
  type: 'content',
})

export const collections = {
  post: postCollection,
}
