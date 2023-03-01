import { getCollection } from 'astro:content'
import { parse } from 'date-fns'

const POST_FILENAME_REGEX = /(\d{4}-\d{2}-\d{2})-(.+)/

const rawPosts = await getCollection('post')

rawPosts.sort(
  (a, b) =>
    parse(
      b.slug.match(POST_FILENAME_REGEX)?.[1] ?? '',
      'yyyy-MM-dd',
      new Date()
    ).getTime() -
    parse(
      a.slug.match(POST_FILENAME_REGEX)?.[1] ?? '',
      'yyyy-MM-dd',
      new Date()
    ).getTime()
)

export const posts = rawPosts.map((post) => ({
  ...post,
  path: post.slug.match(POST_FILENAME_REGEX)?.[2]!,
}))
