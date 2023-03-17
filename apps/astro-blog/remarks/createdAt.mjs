import { format, setDefaultOptions } from 'date-fns'
import { ko } from 'date-fns/locale/index'

setDefaultOptions({ locale: ko })

export function remarkCreatedAt() {
  const POST_FILENAME_REGEX = /(\d{4})-(\d{2})-(\d{2})-(.+)/

  return function (_, { data, history }) {
    if (data.astro.frontmatter.title === 'about') {
      return
    }

    const [fileName] = history
    const dirName = fileName.split('/').at(-1)
    const [, year, month, day] = POST_FILENAME_REGEX.exec(dirName) ?? []

    data.astro.frontmatter.createdAt = format(
      new Date(Number(year), Number(month) - 1, Number(day)),
      'yyyy-MM-dd'
    )
  }
}
