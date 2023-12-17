import dayjs from 'dayjs'

export function remarkCreatedAt() {
  const POST_FILENAME_REGEX = /(\d{4})-(\d{2})-(\d{2})-(.+)/

  return function (_, { data, history }) {
    if (data.astro.frontmatter.title === 'about') {
      return
    }

    const [fileName] = history
    const dirName = fileName.split('/').at(-1)
    const [, year, month, day] = POST_FILENAME_REGEX.exec(dirName) ?? []

    data.astro.frontmatter.createdAt = dayjs([
      Number(year),
      Number(month) - 1,
      Number(day),
    ]).format('YYYY-MM-DD')
  }
}
