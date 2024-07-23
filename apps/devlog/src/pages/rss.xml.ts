import type { APIContext } from 'astro'

import rss from '@astrojs/rss'
import { getPosts } from '#/collection'
import { dayjs } from '#/dayjs'
import { sitemeta } from '#/sitemeta'

export async function get(context: APIContext) {
  const posts = await getPosts()

  return rss({
    description: sitemeta.description,
    items: posts.map((post) => ({
      description:
        post.rendered.remarkPluginFrontmatter.description ||
        post.rendered.remarkPluginFrontmatter.title,
      link: `/post/${post.path}/`,
      pubDate: dayjs(post.createdAt, 'YYYY-MM-DD', 'ko').toDate(),
      title: post.rendered.remarkPluginFrontmatter.title,
    })),
    site: context.site!.toString(),
    title: sitemeta.title,
  })
}
