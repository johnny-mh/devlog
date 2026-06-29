import { describe, expect, it } from 'vitest'

// dist is built by test/global-setup.ts before the suite runs
import fuse from '../dist/index.mjs'

describe('options validation', () => {
  it("throws when the removed `basedOn: 'source'` option is used", () => {
    // @ts-expect-error `basedOn` was removed from the public type in v2
    expect(() => fuse(['content'], { basedOn: 'source' })).toThrow(
      /removed in v2/
    )
  })
})
