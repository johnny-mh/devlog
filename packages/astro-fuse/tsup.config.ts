import { defineConfig } from 'tsup'

export default defineConfig({
  dts: true,
  entry: {
    client: 'src/loadFuse.ts',
    index: 'src/index.ts',
  },
  format: ['esm'],
})
