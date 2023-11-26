import { z, defineCollection } from 'astro:content'

const postCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    createdAt: z.string(),
    readingTime: z.number(),
  }),
})

export const collection = {
  post: postCollection,
}
