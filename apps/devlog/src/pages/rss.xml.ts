import type { APIRoute } from 'astro'

import rss from '@astrojs/rss'
import { getPosts } from '#/collection'
import { dayjs } from '#/dayjs'
import { sitemeta } from '#/sitemeta'

export const GET: APIRoute = async (context) => {
  const posts = await getPosts()

  return rss({
    description: sitemeta.description,
    items: posts.map((post) => ({
      description:
        post.rendered.remarkPluginFrontmatter.description ||
        post.rendered.remarkPluginFrontmatter.title,
      link: `/blog/${post.slug}/`,
      pubDate: dayjs(post.data.publishedAt).toDate(),
      title: post.rendered.remarkPluginFrontmatter.title,
    })),
    site: context.site!.toString(),
    title: sitemeta.title,
  })
}
