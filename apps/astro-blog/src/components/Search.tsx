import { Searchable } from 'astro-fuse'
import { useStore } from '@nanostores/preact'
import Fuse from 'fuse.js'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import styles from './Search.module.css'
import { appAtom } from '#/stores/app'
import { shuffle } from '#/util/common'
import { string } from 'astro/zod'

interface SearchedItem {
  title: string
  slug: string
}

export function Search(props: { tags: Set<string> }) {
  const tags = useMemo(
    () => shuffle(Array.from(props.tags.values())).slice(0, 5),
    []
  )

  const app = useStore(appAtom)
  const fuse = useRef<Fuse<Searchable> | null>(null)
  const inpRef = useRef<HTMLInputElement>(null)
  const [reveal, setReveal] = useState('')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    if (!query || !fuse.current) {
      return []
    }

    const list = fuse.current.search(query)

    return list.reduce<SearchedItem[]>(
      (
        arr,
        {
          item: {
            frontmatter: { title },
            fileUrl,
          },
        }
      ) => {
        const url = decodeURIComponent(fileUrl)
        const [, slug] = /\d{4}-\d{2}-\d{2}-(.*)\.mdx?/.exec(url) ?? []

        if (slug) {
          arr.push({ title, slug })
        }

        return arr
      },
      []
    )
  }, [query])

  const close = () => {
    setReveal('')
    inpRef.current?.blur()
    setTimeout(() => appAtom.set({ showSearch: false }), 1000)
  }

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
  }

  const onInput = (e) => setQuery((e.target as HTMLInputElement).value)

  const onTagClick = (name: string) => {
    if (inpRef.current) {
      inpRef.current.value = name
      inpRef.current.select()
    }

    setQuery(name)
  }

  useEffect(() => {
    loadFuse().then((inst) => (fuse.current = inst))
  }, [])

  useEffect(() => {
    if (app.showSearch) {
      setReveal('reveal')
      inpRef.current?.focus()
    }

    document.addEventListener('keyup', onKeyUp)

    return () => {
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [app.showSearch])

  return (
    <div className={`${styles.wrapper} ${reveal}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <form onSubmit={() => {}}>
            <input
              className={styles.inp}
              type="text"
              placeholder="Type to Search"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              ref={inpRef}
              onInput={onInput}
            />
          </form>

          <button className={styles.closeBtn} type="button" onClick={close}>
            <img src="/close.svg" width={25} height={25} alt="close" />
          </button>
        </div>
        <div className={styles.tags}>
          {tags.map((name) => (
            <button key={name} onClick={() => onTagClick(name)}>
              {name}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          <ul className={styles.searchResult}>
            {list.map((item) => (
              <li key={item.slug}>
                <a href={`/post/${item.slug.toLowerCase()}`}>{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
