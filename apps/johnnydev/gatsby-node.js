/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const { createFilePath } = require("gatsby-source-filesystem")
const dayjs = require("dayjs")

const POST_FILENAME_REGEX = /(\d{4})-(\d{2})-(\d{2})-(.+)\/$/

exports.onCreateNode = ({ node, actions: { createNodeField }, getNode }) => {
  if (node.internal.type !== "MarkdownRemark") {
    return
  }

  const slug = createFilePath({ node, getNode })
  const match = POST_FILENAME_REGEX.exec(slug)

  if (match !== null) {
    const [, year, month, day, filename] = match
    const date = dayjs([Number(year), Number(month), Number(day)])
    const updatedAt = node.frontmatter.updatedAt
      ? dayjs(node.frontmatter.updatedAt).toISOString()
      : null

    createNodeField({ name: "slug", node, value: `/post/${filename}` })
    createNodeField({ name: "type", node, value: "post" })
    createNodeField({ name: "date", node, value: date.toISOString() })
    createNodeField({ name: "updatedAt", node, value: updatedAt })
  } else {
    createNodeField({ name: "slug", node, value: slug })
    createNodeField({ name: "type", node, value: "page" })
  }
}
