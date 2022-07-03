import Fuse from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';

export const useFusejs = <T = any>(
  query: string,
  data: { index: string; data: T[] },
  fuseOpts?: Fuse.IFuseOptions<T>,
  parseOpts?: Fuse.FuseIndexOptions<T>,
  searchOpts?: Fuse.FuseSearchOptions
) => {
  const [fuseInst, setFuseInst] = useState<null | Fuse<T>>(null);

  useEffect(() => {
    if (!data?.index) {
      setFuseInst(null);
      return;
    }

    const inst = new Fuse(
      data.data,
      fuseOpts,
      Fuse.parseIndex(JSON.parse(data.index), parseOpts)
    );

    setFuseInst(inst);
  }, [data, parseOpts]);

  return useMemo(() => {
    if (!query || !data) {
      return [];
    }

    return fuseInst?.search(query, searchOpts) || [];
  }, [query, data, fuseInst]);
};

export default useFusejs;
