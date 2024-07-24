import type { IFuseOptions } from 'fuse.js'
import type Fuse from 'fuse.js'

import { Searchable } from './types'

export { Searchable }

export interface ILoadFuseFn {
  (opts?: {
    init?: RequestInit
    options?: IFuseOptions<Searchable>
    url?: string
  }): Promise<Fuse<Searchable>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  index?: any
}

export const loadFuse: ILoadFuseFn = async (opts) => {
  const { init, options, url = '/fuse.json' } = opts ?? {}

  const [Fuse, { index, list }] = await Promise.all([
    import('fuse.js'),
    loadFuse.index
      ? Promise.resolve(loadFuse.index)
      : fetch(url, init)
          .then((res) => res.json())
          .then((_index) => {
            loadFuse.index = _index

            return _index
          }),
  ])

  return new Fuse.default(list, options, Fuse.default.parseIndex(index))
}
