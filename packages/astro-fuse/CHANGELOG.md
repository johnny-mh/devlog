# astro-fuse

## 1.0.3

### Patch Changes

- support astro v5

## 1.0.1

### Patch Changes

- Fixed an issue where a build error occurred when there were no arguments to the 'fuse()' function.

## 1.0.0

### Major Changes

- 672ab45: - Migrate core packages (astro@4.12.2, fuse.js@7.0.0)

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

## 0.0.7

### Patch Changes

- b1011d2: fix: enhance output log @bennycode
- b1011d2: fix: wrong argument type of integration function

## 0.0.6

### Patch Changes

- export `Searchable` type and adding example

## 0.0.5

### Patch Changes

- Added `basedOn: output` mode to support rendered HTML based search features.

## 0.0.4

### Patch Changes

- 9fd111b: fix instance loading timing issue.

## 0.0.3

### Patch Changes

- a707841: update astro to v2.1

## 0.0.2

### Patch Changes

- 0df9d2f: update package information
