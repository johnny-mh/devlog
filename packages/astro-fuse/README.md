# astro-fuse

This [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) generates the _fuse.json_ index file of [Fuse.js](https://fusejs.io/) when your Astro project during build.

Use this plugin to add content search functionality to your Astro site.

## Usage

First, install the `astro-fuse` packages using your package manager.

```sh
npx astro add astro-fuse

pnpm astro add astro-fuse

yarn astro add astro-fuse
```

Then, apply this integration to your `astro.config.*` file using the integrations property:

```js ins={3} "fuse(['content'])"
// astro.config.mjs
import { defineConfig } from 'astro/config'
import fuse from 'astro-fuse'

export default defineConfig({
  integrations: [fuse(['content'])],
})
```

When you install the integration, you can add search component on a page.

> You need run `astro build` before using it. for detailed explanations, please refer to the [remarks](#remarks) section below.

```astro
<!-- Search.astro -->
<custom-search>
  <input data-search-inp type="text" />
  <ul data-search-result></ul>
</custom-search>

<script>
  import type { OutputBaseSearchable } from 'astro-fuse'

  class CustomSearch extends HTMLElement {
    list = this.querySelector<HTMLUListElement>('[data-search-result]')

    constructor() {
      super()

      this.querySelector<HTMLInputElement>(
        '[data-search-inp]'
      )?.addEventListener('input', this.onInput.bind(this))
    }

    async onInput(e: Event) {
      const { list } = this

      if (!list) {
        return
      }

      // create fuse instance from index
      const { loadFuse } = await import('astro-fuse/client')
      const fuse = await loadFuse()

      const results = fuse.search<OutputBaseSearchable>((e.target as HTMLInputElement).value.trim())

      list.innerHTML = results
        .map(
          ({ item }) =>
            `<li><a href="${item.pathname}">${item.frontmatter.title}</a></li>`
        )
        .join('')
    }
  }

  customElements.define('custom-search', CustomSearch)
</script>
```

You can also just load and use the index file as shown in the example below.

> Since the size of the index file can be large depending on the settings, it is recommended to lazy-load the index file.

```astro
<!-- Search.astro -->
<script>
  import Fuse from 'fuse.js'

  fetch('/fuse.json')
    .then(res => res.json())
    .then(({index, list}) => {
      const fuse = new Fuse(list, undefined, Fuse.parseIndex(index))

      fuse.search('...')
    })
</script>
```

## Methods and Options

### fuse(keys, [options])

#### keys

You can provide the key values of the properties you want to search in addition to the body.

See [Fuse.js keys option](https://www.fusejs.io/api/options.html#keys)

#### basedOn

- **default** `'output'`: Generate index files based on the HTML files that generated after the build. This mode will allow you to search for the static rendering results of components used in MDX files.
- `'source'`: Generated index files based on the markdown source in the content folder. This mode will update the index in real time in the development environment. In addition, you can search for frontmatters in markdown immediately by adding it to the keys array without any other process.

Since each mode has its own advantages and disadvantages, please use it appropriately according to the situation.

> If you use the 'basedOn' option as 'source', the search results will include 'fileUrl' instead of 'pathname'. Convert 'fileUrl' to a link path and use it.

#### filename

The file name of the index file to be generated.

#### filter

##### `basedOn: 'output'` mode

In 'output' mode, all HTML files generated as a result of the build are subject to search index generation. If you want to restrict this, use the filter option.

```js
// astro.config.mjs
fuse(['content', 'frontmatter.title'], {
  filter: (path) => /^\/post\/[^/]+\/$/.test(path),
})
```

##### `basedOn: 'source'` mode

In 'source' mode, all markdown files in the `/src/content` folder are subject to search index generation. If you want to restrict this to a specific file, use the filter option.

```js
// astro.config.mjs
fuse(['content', 'frontmatter.title'], {
  filter: (path) => path.startsWith('/src/content/post/'),
})
```

#### extractContentFromHTML (only for `output` mode)

Setting the `basedOn` option to `'output'` will now generate the index file based on the HTML files generated after the build. This may include unnecessary content such as text in the header area. You can use the extractContentFromHTML option to select the elements that need to be searched.

```js
// astro.config.mjs
// ...
fuse(
  ['content', 'frontmatter.title'],
  {
    extractContentFromHTML: 'article' // index text inner <article> element.
    extractContentFromHTML: $ => $('div#content') // or. you can use cheerio instance.
  }
)
```

#### extractFrontmatterFromHTML (only for `output` mode)

In `'output'` mode, the index is generated based on the rendered HTML files, so frontmatter cannot be extracted. If frontmatter is required, you can use the extractFrontmatterFromHTML option to make frontmatter searchable as well.

For example, if you need the original title value because the pathname is sluggified, the following MDX file can be bundled into various path HTML files like /content/2023-08-14-a-page-title.mdx => blog/2023/08/a-page-title.html.

```astro
---
title: A Page Title
---
```

In this situation, the `extractFrontmatterFromHTML` option can be helpful. If you render the title to the `meta[property="og:title"]` tag, you can get it with the following options.

```js
// astro.config.mjs

fuse(['content', 'frontmatter.title'], {
  extractFrontmatterFromHTML: ($) => {
    // read that element value. $ is cheerio instance.
    const el = $('[data-frontmatter]')

    if (el.length) {
      return JSON.parse(el.first().val())
    }

    return { title: $('h1').first().text() }
  },
})
```

```astro
<!-- [slug].astro -->
---
const { frontmatter } = Astro.props;
---

<html>
<!-- .. make hidden input for render frontmatter .. -->
<input
    type="hidden"
    data-frontmatter
    value={JSON.stringify(frontmatter)}
/>
</html>
```

The `$` is a Cheerio instance, and you can use it to search for elements. For more information, see the Selecting Elements links. [Selecting Elements](https://cheerio.js.org/docs/basics/selecting)

### loadFuse([options])

#### url

The path to the index file to be used as the first argument of `fetch`.

#### init

A `RequestInit` object containing any custom settings that you want to apply to the request.

See [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch#options)

#### options

The option object used when creating a Fuse.js instance.

See [Fuse.js options](https://www.fusejs.io/api/options.html)

## Example

- [The search component of the johnny-dev blog](/apps/devlog/src/components/SearchComponent.tsx)

## Remarks

- In a development environment, the index file for Fuse.js may not be created immediately when the server starts. In this case, you can request a page that uses a Markdown file to trigger the build process. Please note that the file is created immediately in the production build stage. If it is not created, please report an issue.
