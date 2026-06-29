---
"astro-fuse": major
---

Require Astro 5 or later, and remove the `basedOn: 'source'` mode.

Astro 5 changed two things this integration relied on:

- The `astro:build:done` hook no longer exposes `routes` (it crashed with `Cannot read properties of undefined (reading 'reduce')`). Route data is now read from the `astro:routes:resolved` hook.
- The Content Layer reads collection files directly from disk, so Vite's `transform` hook no longer fires for content files. The `basedOn: 'source'` mode depended on that hook and could not produce an index on Astro 5+.

Changes:

- **Breaking:** `peerDependencies` is now `astro >= 5.0.0`. Astro 4 users should stay on the `1.x` line.
- **Breaking:** removed `basedOn: 'source'`. Output mode is now the only mode; the `basedOn` option, `SourceBaseAstroFuseOptions`, and `SourceBaseSearchable` were removed. Passing `basedOn: 'source'` throws with a migration message.
- **Breaking:** `OutputBaseAstroFuseOptions` is no longer exported. It is now identical to `AstroFuseOptions` — import that instead.
- Verified against Astro 5, 6, and 7 (Vite 8 / rolldown-vite) via a new fixture-based integration test suite.
