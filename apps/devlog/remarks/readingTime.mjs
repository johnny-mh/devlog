import { toString } from 'mdast-util-to-string'
import getReadingTime from 'reading-time'

export function remarkReadingTime() {
  return function (tree, post) {
    const textOnPage = toString(tree)
    const readingTime = getReadingTime(textOnPage)

    post.data.astro.frontmatter.readingTime = readingTime.time
  }
}
