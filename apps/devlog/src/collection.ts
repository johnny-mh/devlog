import { getCollection, render } from 'astro:content'
import Slugger from 'github-slugger'

import type { RenderedPostEntry } from './types'

import { dayjs } from './dayjs'

export const getPosts = async () => {
  const posts = await getCollection('post', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  )

  const list = await Promise.all(
    posts.map((post) =>
      render(post).then(
        (rendered) => ({ ...post, rendered }) as RenderedPostEntry
      )
    )
  )

  return list.toSorted(
    (a, b) =>
      dayjs(b.data.publishedAt).unix() - dayjs(a.data.publishedAt).unix()
  )
}

export const getPostTags = async () => {
  const posts = await getCollection('post', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  )

  let tags = new Set<string>()

  for (const post of posts) {
    tags = new Set<string>([...tags, ...new Set<string>(post.data.tags)])
  }

  return Array.from(tags)
}

export const getPostCategories = async () => {
  const slugger = new Slugger()
  const posts = await getCollection('post', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  )

  const categories = new Map<string, number>()

  for (const post of posts) {
    for (const cat of post.data.categories as string[]) {
      categories.set(cat, (categories.get(cat) ?? 0) + 1)
    }
  }

  return Array.from(categories.entries())
    .map(([category, count]) => ({
      category,
      count,
      slug: slugger.slug(category),
    }))
    .toSorted((a, b) => b.count - a.count)
}
