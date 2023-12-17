import rss from '@astrojs/rss'
import type { APIContext } from 'astro'

import { getPosts } from '#/collection'
import { dayjs } from '#/dayjs'
import { sitemeta } from '#/sitemeta'

export async function get(context: APIContext) {
  const posts = await getPosts()

  return rss({
    title: sitemeta.title,
    description: sitemeta.description,
    site: context.site!.toString(),
    items: posts.map((post) => ({
      title: post.rendered.remarkPluginFrontmatter.title,
      description:
        post.rendered.remarkPluginFrontmatter.description ||
        post.rendered.remarkPluginFrontmatter.title,
      pubDate: dayjs(post.createdAt, 'YYYY-MM-DD', 'ko').toDate(),
      link: `/post/${post.path}/`,
    })),
  })
}
