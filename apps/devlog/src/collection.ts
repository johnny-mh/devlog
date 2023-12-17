import { getCollection } from 'astro:content'

import { dayjs } from '#/dayjs'

const POST_FILENAME_REGEX = /(\d{4}-\d{2}-\d{2})-(.+)/

const rawPosts = await getCollection('post')

rawPosts.sort(
  (a, b) =>
    dayjs(
      b.slug.match(POST_FILENAME_REGEX)?.[1] ?? '',
      'YYYY-MM-DD',
      'ko'
    ).unix() -
    dayjs(
      a.slug.match(POST_FILENAME_REGEX)?.[1] ?? '',
      'yyyy-MM-dd',
      'ko'
    ).unix()
)

export const getPosts = () =>
  Promise.all(
    rawPosts.map((post) =>
      post.render().then((rendered) => {
        const [, createdAt, path] = post.slug.match(POST_FILENAME_REGEX) ?? []
        return {
          ...post,
          path,
          rendered,
          createdAt,
          readingTime: dayjs
            .duration(rendered.remarkPluginFrontmatter.readingTime)
            .locale('ko')
            .humanize(),
        }
      })
    )
  )
