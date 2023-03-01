import { format, setDefaultOptions } from 'date-fns'
import { ko } from 'date-fns/locale/index'

setDefaultOptions({ locale: ko })

export function remarkCreatedAt() {
  const POST_FILENAME_REGEX = /(\d{4})-(\d{2})-(\d{2})-(.+)/

  return function (_, { data, history }) {
    const [fileName] = history
    const dirName = fileName.split('/').at(-1)
    const match = POST_FILENAME_REGEX.exec(dirName)

    if (!match) {
      throw new Error(`컨텐츠 경로 규칙 확인 요망: ${fileName}`)
    }
    const [, year, month, day] = Array.from(match)

    data.astro.frontmatter.createdAt = format(
      new Date(Number(year), Number(month) - 1, Number(day)),
      'yyyy-MM-dd'
    )
  }
}
