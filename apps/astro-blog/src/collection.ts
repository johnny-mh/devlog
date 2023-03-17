import { getCollection } from 'astro:content'
import {
  formatDuration,
  intervalToDuration,
  parse,
  roundToNearestMinutes,
} from 'date-fns'

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
          readingTime: formatDuration(
            intervalToDuration({
              start: 0,
              end: roundToNearestMinutes(
                rendered.remarkPluginFrontmatter.readingTime
              ).getTime(),
            })
          ),
        }
      })
    )
  )
