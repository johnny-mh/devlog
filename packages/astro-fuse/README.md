# astro-fuse

This [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) generates the _fuse.json_ index file of [Fuse.js](https://fusejs.io/) when your Astro project during build.

Use this plugin to add search functionality to your Astro site.

## Installation

First, install the `fuse.js` and `astro-fuse` packages using your package manager.

```sh
npm isntall fuse.js astro-fuse
```

Then, apply this integration to your `astro.config.*` file using the `integrations` property.

**`astro.config.mjs`**

```js ins={2} "fuse({ keys: ['content', 'frontmatter.title'] })"
import { defineConfig } from 'astro/config';
import fuse from 'astro-fuse'

export default defineConfig({
  // ...
      ,
  integrations: [fuse({ keys: ['content', 'frontmatter.title'] })],
});
```

## Configure

By passing arguments to the provided fuse function, you can configure the options of Fuse.js.

**`astro.config.mjs`**

```js ins={7}
import { defineConfig } from 'astro/config';
import fuse from 'astro-fuse'

export default defineConfig({
  // ...
      ,
  integrations: [fuse({ keys: ['content', 'frontmatter.title'] })],
});
```

The example code above is setting options to create an index for the contents of the body and the `frontmatter.title` property.

(Just a heads up, `'content'` is a string literal that refers to the body of the documents)

In addition to the example described above, you can use [various options listed in the Fuse.js](https://fusejs.io/api/options.html) official documentation.

## Usage

The generated `fuse.json` file can be used on web pages as follows:

```js
// Please refer to the Fuse.js official API documentation for the arguments of `loadFuse`
const fuse = await loadFuse(options)

const result = fuse.search('search keyword')
```

`astro-fuse` adds a function called `'loadFuse'` to the global context. Calling this function will give you an instance of `Fuse.js` that uses the generated index during the build process.

### Basic Example

```astro
<input type="text" data-search-inp />
<ul data-search-result></ul>

<script>
  import type Fuse from 'fuse.js';
  import type { Searchable } from 'astro-fuse';

  const inp = document.querySelector<HTMLInputElement>('[data-search-inp]');
  const ul = document.querySelector('[data-search-result]');

  let inst: Fuse<Searchable>;

  function load() {
    // for prevent duplicated requests
    if (!inst) {
      return loadFuse().then((_inst) => {
        inst = _inst;
        return inst;
      });
    }

    return Promise.resolve(inst);
  }

  inp?.addEventListener("input", () => {
    load()
      .then((fuse) => fuse.search(inp?.value))
      .then((results) => {
        if (!ul) {
          return;
        }

        ul.innerHTML = results
          .map(({ item }) => `<li>${item.fileUrl}</li>`)
          .join('');
      });
  });
</script>
```


### Preact Example


```js
export function Search() {
  const fuse = useRef(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    loadFuse().then((inst) => (fuse.current = inst))
  }, [])

  const list = useMemo(() => {
    if (!query || !fuse.current) {
      return []
    }

    return fuse.current.search(query)
  }, [query])

  return (
    <div>
      <input type="text" onInput={(e) => setQuery(e.target.value)} />
      <ul>
        {list.map((item) => {
          return (
            <li>
              <div>{item.fileUrl}</div>
              <div>{item.content}</div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

The output format of the search method is as follows:

- fileUrl: The file path of the searched document.
- content: The body of the searched document.
- ...[Other Fuse.js search result data.](https://fusejs.io/examples.html#search-object-array)

Alternatively, you can directly load fuse.json and use it instead of using loadFuse. Below is an example code for that:

**`astro.config.mjs`**

```js ins={10}
import { defineConfig } from 'astro/config';
import fuse from 'astro-fuse'

export default defineConfig({
  // ...
      ,
  integrations: [
    fuse({
      keys: ['content', 'frontmatter.title'],
      injectScript: false
    })
  ],
});
```

```js
function loadFuseCustom(options) {
  return Promise.all([
    import('fuse.js'),
    fetch('/fuse.json').then((res) => res.json()),
  ]).then(
    ([Fuse, { list, index }]) =>
      new Fuse.default(
        list,
        // Note that the value of keys should be the same as the one passed to astro.config.*
        { keys: ['content', 'frontmatter.title'] },
        Fuse.default.parseIndex(index)
      )
  )
}
```

## Remarks

1. Since this plugin goes through a separate processing step using mdast and micromark to handle markdown files, elements other than text in markdown files (components rendered with `@astrojs/mdx`) may not be searchable.
2. In a development environment, the index file for Fuse.js may not be created immediately when the server starts. In this case, you can request a page that uses a Markdown file to trigger the build process. Please note that the file is created immediately in the production build stage. If it is not created, please report an issue.
