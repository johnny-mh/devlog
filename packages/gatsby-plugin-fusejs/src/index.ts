import fs from 'fs'
import Fuse from 'fuse.js'
import {
  CreatePagesArgs,
  CreateSchemaCustomizationArgs,
  NodeInput,
} from 'gatsby'
import path from 'path'

interface PluginOptions {
  keys: string[]
  normalizer: (input: {
    data?: unknown
    errors?: unknown
  }) => Record<string, unknown>[]
  query: string
}

const msg = (str: string) => `[gatsby-plugin-fusejs] ${str}`

export const createPages = async (
  ctx: CreatePagesArgs,
  opts: PluginOptions
) => {
  const { keys, normalizer, query } = opts
  const { actions, createContentDigest, createNodeId, graphql, reporter } = ctx

  const result = await graphql(query)

  if (result.errors) {
    reporter.error(
      msg(
        'The provided GraphQL query contains errors. The index will not be created.'
      ),
      result.errors[0]
    )
    return
  }

  const data = normalizer(result) || []

  if (!data.length) {
    reporter.warn(
      msg(
        `The query for index returned no nodes. The index and store will be empty.`
      )
    )
    return
  }

  const index = Fuse.createIndex(keys, data)

  actions.createNode({
    data,
    id: createNodeId(`fusejs`),
    index: JSON.stringify(index.toJSON()),
    internal: {
      contentDigest: createContentDigest({ data, index }),
      type: `fusejs`,
    },
  })
}

interface FuseNodeInput extends NodeInput {
  data: unknown
  index: string
}

export const createSchemaCustomization = async (
  ctx: CreateSchemaCustomizationArgs
) => {
  const { actions, pathPrefix, reporter, schema } = ctx
  const { createTypes } = actions

  createTypes([
    schema.buildObjectType({
      fields: {
        data: {
          description: 'The data returned by the GraphQL query.',
          type: 'JSON!',
        },
        index: {
          description:
            'The JSON serialized search index string created using the fusejs.',
          type: 'String!',
        },
        publicUrl: {
          description: 'The public URL of the search index and data.',
          resolve: (node: FuseNodeInput) => {
            const filename = `${node.internal.contentDigest}.index.json`

            const publicPath = path.join(
              process.cwd(),
              'public',
              'static',
              filename
            )

            if (!fs.existsSync(publicPath))
              fs.writeFile(
                publicPath,
                JSON.stringify({ data: node.data, index: node.index }),
                (err) => {
                  if (err)
                    reporter.error(
                      msg(
                        `Could not save the index for "${name}" to ${publicPath}`
                      )
                    )
                }
              )

            return `${pathPrefix}/static/${filename}`
          },
          type: 'String!',
        },
      },
      interfaces: ['Node'],
      name: 'fusejs',
    }),
  ])
}
