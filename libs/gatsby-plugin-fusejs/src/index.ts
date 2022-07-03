import fs from 'fs';
import Fuse from 'fuse.js';
import {
  CreatePagesArgs,
  CreateSchemaCustomizationArgs,
  NodeInput,
} from 'gatsby';
import path from 'path';

interface PluginOptions {
  query: string;
  keys: string[];
  normalizer: (input: {
    data?: unknown;
    errors?: unknown;
  }) => Record<string, unknown>[];
}

const msg = (str: string) => `[gatsby-plugin-fusejs] ${str}`;

export const createPages = async (
  ctx: CreatePagesArgs,
  opts: PluginOptions
) => {
  const { query, keys, normalizer } = opts;
  const { actions, graphql, reporter, createNodeId, createContentDigest } = ctx;

  const result = await graphql(query);

  if (result.errors) {
    reporter.error(
      msg(
        'The provided GraphQL query contains errors. The index will not be created.'
      ),
      result.errors[0]
    );
    return;
  }

  const data = normalizer(result) || [];

  if (!data.length) {
    reporter.warn(
      msg(
        `The query for index returned no nodes. The index and store will be empty.`
      )
    );
    return;
  }

  const index = Fuse.createIndex(keys, data);

  actions.createNode({
    id: createNodeId(`fusejs`),
    index: JSON.stringify(index.toJSON()),
    data,
    internal: {
      type: `fusejs`,
      contentDigest: createContentDigest({ index, data }),
    },
  });
};

interface FuseNodeInput extends NodeInput {
  index: string;
  data: any;
}

export const createSchemaCustomization = async (
  ctx: CreateSchemaCustomizationArgs
) => {
  const { actions, schema, reporter, pathPrefix } = ctx;
  const { createTypes } = actions;

  createTypes([
    schema.buildObjectType({
      name: 'fusejs',
      fields: {
        index: {
          type: 'String!',
          description: 'The search index created using the fusejs.',
        },
        data: {
          type: 'JSON!',
          description: 'The data returned by the GraphQL query.',
        },
        publicUrl: {
          type: 'String!',
          description: 'The public URL of the search index and data.',
          resolve: (node: FuseNodeInput) => {
            const filename = `${node.internal.contentDigest}.index.json`;

            const publicPath = path.join(
              process.cwd(),
              'public',
              'static',
              filename
            );

            if (!fs.existsSync(publicPath))
              fs.writeFile(
                publicPath,
                JSON.stringify({ index: node.index, data: node.data }),
                (err) => {
                  if (err)
                    reporter.error(
                      msg(
                        `Could not save the index for "${name}" to ${publicPath}`
                      )
                    );
                }
              );

            return `${pathPrefix}/static/${filename}`;
          },
        },
      },
      interfaces: ['Node'],
    }),
  ]);
};
