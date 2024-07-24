import { defineCollection, z } from 'astro:content'

const postCollection = defineCollection({
  schema: z.object({
    createdAt: z.string(),
    readingTime: z.number(),
    tags: z.array(z.string()),
    title: z.string(),
  }),
})

export const collection = {
  post: postCollection,
}
