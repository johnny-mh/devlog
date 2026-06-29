import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Each test runs a real `astro build` on a fixture, so give it room.
    globalSetup: ['./test/global-setup.ts'],
    hookTimeout: 120_000,
    testTimeout: 120_000,
  },
})
