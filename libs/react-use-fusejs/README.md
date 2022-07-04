# react-use-fusejs

React hook to search a [Fuse.js](https://fusejs.io/) index

## Install

```sh
npm install --save react-use-fusejs
```

## How to use

### `useFusejs`

```js
import Fuse from 'fuse.js';
import useFusejs from 'react-use-fusejs';

const books = [
  {
    title: "Old Man's War",
    author: {
      firstName: 'John',
      lastName: 'Scalzi',
    },
  },
  {
    title: 'The Lock Artist',
    author: {
      firstName: 'Steve',
      lastName: 'Hamilton',
    },
  },
];

// Create the Fuse index
const myIndex = Fuse.createIndex(['title', 'author.firstName'], books);

export function Search() {
  const [query, setQuery] = useState('');
  const results = useFusejs(query, books, myIndex);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            {result.title} by {result.author.firstName} {result.author.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Arguments

- `query`: The search query
- `data`: The search data
- `index`: The Fuse index. see [Fuse.js indexing](https://fusejs.io/api/indexing.html)
- `fuseOpts`: A object of Fuse.js options. see [Fuse.js options](https://fusejs.io/api/options.html)
- `parseOpts`: A object of Fuse.parseIndex. see [Fuse.parseIndex](https://fusejs.io/api/parsing.html#fuse-parseindex)
- `searchOpts`: A object of Fuse.search

### `useGatsbyPluginFusejs`

hook for data from `gatsby-plugin-fusejs`. please see [gatsby-plugin-fusejs](https://www.gatsbyjs.org/packages/gatsby-plugin-fusejs/)
