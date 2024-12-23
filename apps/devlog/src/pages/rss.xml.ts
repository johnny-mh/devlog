import type { APIRoute } from 'astro'

import rss from '@astrojs/rss'
import { getSortedPosts } from '#/collection'
import { dayjs } from '#/dayjs'
import { sitemeta } from '#/sitemeta'

export const GET: APIRoute = async (context) => {
  const posts = await getSortedPosts()

  return rss({
    description: sitemeta.description,
    items: posts.map((post) => ({
      description: post.data.description || post.data.title,
      link: `/blog/${post.id}/`,
      pubDate: dayjs(post.data.publishedAt).toDate(),
      title: post.data.title,
    })),
    site: context.site!.toString(),
    title: sitemeta.title,
  })
}
