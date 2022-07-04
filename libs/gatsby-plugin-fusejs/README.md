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
            allMarkdownRemark(filter: {fields: {type: {eq: "post"}}}) {
              nodes {
                id
                rawMarkdownBody
                frontmatter {
                  path
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
            path: node.frontmatter.path,
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

  const [query, setQuery] = useState('');
  const result = useGatsbyPluginFusejs(query, data.fusejs);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {result.map((item) => (
          <li key={item.id}>
            <Link to={item.path}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Lazy-loading the search data

The `fusejs` node also have url for the search data. You can use this url to lazy-load the search data.

```jsx
import { useGatsbyPluginFusejs } from 'react-use-fusejs';

export function Search() {
  const data = useStaticQuery(graphql`
    {
      fusejs {
        publicUrl
      }
    }
  `);

  const [query, setQuery] = useState('');
  const [fusejs, setFusejs] = useState(null);
  const result = useGatsbyPluginFusejs(query, fusejs);

  useEffect(() => {
    fetch(data.fusejs.publicUrl)
      .then((res) => res.json())
      .then((json) => setFusejs(json));
  }, []);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {result.map((item) => (
          <li key={item.id}>
            <Link to={item.path}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```
