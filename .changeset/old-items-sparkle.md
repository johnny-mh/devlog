---
"astro-fuse": major
---

- Migrate core packages (astro@4.12.2, fuse.js@7.0.0)
- Add `filename` option to `fuse()`
- Regardless of the `basedOn` mode, the `filter` option can now be used
- Export `loadFuse()` function from `'astro-fuse/client'`

**BREAKING CHANGES**

- The `injectScript` option removed from `fuse()`. No more adding `loadFuse()` function to global context. Please use `loadFuse()` from `'astro-fuse/client'`

  ```ts
  loadFuse()
    .then(fuse => fuse.search('...')) // deprecated

  import('astro-fuse/client')
    .then(mod => mod.loadFuse())
    .then(fuse => fuse.search(...))
  ```

- The default value of the `basedOn` option has been changed from `'source'` to `'output'`.
