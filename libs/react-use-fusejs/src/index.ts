import Fuse from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';

export function useFusejs<T>(
  query: string,
  data: T[],
  index: Fuse.FuseIndex<T>,
  fuseOpts?: Fuse.IFuseOptions<T>,
  parseOpts?: Fuse.FuseIndexOptions<T>,
  searchOpts?: Fuse.FuseSearchOptions
) {
  const [instance, setInstance] = useState<null | Fuse<T>>(null);

  useEffect(() => {
    if (!data || !index) {
      setInstance(null);
      return;
    }

    const inst = new Fuse<T>(data, fuseOpts, Fuse.parseIndex(index, parseOpts));

    setInstance(inst);
  }, [data, index]);

  return useMemo(() => {
    if (!query || !instance) {
      return [];
    }

    return instance?.search(query, searchOpts) || [];
  }, [query, instance]);
}

export function useGatsbyPluginFusejs<T>(
  query: string,
  fusejs: { data: T[]; index: string },
  fuseOpts?: Fuse.IFuseOptions<T>,
  parseOpts?: Fuse.FuseIndexOptions<T>,
  searchOpts?: Fuse.FuseSearchOptions
) {
  const [instance, setInstance] = useState<null | Fuse<T>>(null);

  useEffect(() => {
    if (!fusejs?.data || !fusejs?.index) {
      setInstance(null);
      return;
    }

    const inst = new Fuse<T>(
      fusejs.data,
      fuseOpts,
      Fuse.parseIndex(JSON.parse(fusejs.index), parseOpts)
    );

    setInstance(inst);
  }, [fusejs]);

  return useMemo(() => {
    if (!query || !instance) {
      return [];
    }

    return instance?.search(query, searchOpts) || [];
  }, [query, instance]);
}

export default useFusejs;
