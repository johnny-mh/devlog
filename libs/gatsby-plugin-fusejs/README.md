# gatsby-plugin-fusejs

A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin that uses [Fuse.js](https://fusejs.io/) to search your content.

## Install

Using `react-use-fusejs` is strongly recommended. You can use Fuse.js without it, but it will be little tricky to use.

```bash
npm install --save gatsby-plugin-fusejs react-use-fusejs
```

## How to use

### Create fusejs nodes

Edit `gatsby-config.js`

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-fusejs`,
      options: {
        query: `
          {
            allMarkdownRemark {
              nodes {
                id
                rawMarkdownBody
                frontmatter {
                  title
                }
              }
            }
          }
        `,
        keys: ['title', 'body'],
        normalizer: ({ data }) =>
          data.allMarkdownRemark.nodes.map((node) => ({
            id: node.id,
            title: node.frontmatter.title,
            body: node.rawMarkdownBody,
          })),
      },
    },
  ],
};
```

#### Options

- `query`: A GraphQL query that returns the data to be indexed.
- `keys`: An array of keys to index. see [Fuse.createIndex](https://fusejs.io/api/indexing.html#fuse-createindex)
- `normalizer`: A function that normalizes the data returned by the query.

### Implementing search in your site

The search data is stored in the `fusejs` node.

```jsx
import { useStaticQuery, graphql } from 'gatsby';
import * as React from 'react';
import { useGatsbyPluginFusejs } from 'react-use-fusejs';

export function Search() {
  const data = useStaticQuery(graphql`
    {
      fusejs {
        index
        data
      }
    }
  `);

  const [query, setQuery] = React.useState('');
  const result = useGatsbyPluginFusejs(query, data.fusejs);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {result.map(({ item }) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
```

#### Lazy-loading the search data

The `fusejs` node also have url for the search data. You can use this url to lazy-load the search data.

```jsx
import { useStaticQuery, graphql } from 'gatsby';
import * as React from 'react';
import { useGatsbyPluginFusejs } from 'react-use-fusejs';

export function Search() {
  const data = useStaticQuery(graphql`
    {
      fusejs {
        publicUrl
      }
    }
  `);

  const [query, setQuery] = React.useState('');
  const [fusejs, setFusejs] = React.useState(null);

  React.useEffect(() => {
    fetch(data.fusejs.publicUrl)
      .then((res) => res.json())
      .then((json) => setFusejs(json));
  }, [data]);

  const result = useGatsbyPluginFusejs(query, fusejs);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {result.map(({ item }) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
```
