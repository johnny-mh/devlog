import type { OutputBaseSearchable, Searchable } from 'astro-fuse'
import type Fuse from 'fuse.js'

import { useStore } from '@nanostores/react'
import { appAtom } from '#/stores/app'
import {
  type FormEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import Styles from './Search.module.scss'

export function SearchComponent({ tags }: { tags: string[] }) {
  const app = useStore(appAtom)
  const fuse = useRef<Fuse<Searchable> | null>(null)
  const inpRef = useRef<HTMLInputElement>(null)
  const [reveal, setReveal] = useState('')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    if (!query || !fuse.current) {
      return []
    }

    return fuse.current.search<OutputBaseSearchable>(query).map(
      ({
        item: {
          frontmatter: { title },
          pathname,
        },
      }) => ({ pathname, title })
    )
  }, [query])

  const close = () => {
    setReveal('')
    inpRef.current?.blur()
    setTimeout(() => appAtom.set({ showSearch: false }), 1000)
  }

  const onInput: FormEventHandler = (e) =>
    setQuery((e.target as HTMLInputElement).value)

  const onTagClick = (name: string) => {
    if (inpRef.current) {
      inpRef.current.value = name
      inpRef.current.select()
    }

    setQuery(name)
  }

  useEffect(() => {
    import('astro-fuse/client')
      .then((mod) => mod.loadFuse({ options: { threshold: 0.3 } }))
      .then((inst) => (fuse.current = inst))
  }, [])

  useEffect(() => {
    if (app.showSearch) {
      setReveal('reveal')
      inpRef.current?.focus()
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keyup', onKeyUp)

    return () => {
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [app.showSearch])

  return (
    <div className={`${Styles.wrapper} ${reveal}`}>
      <div className={Styles.content}>
        <div className={Styles.header}>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className={Styles.inp}
              onInput={onInput}
              placeholder="Type to Search"
              ref={inpRef}
              type="text"
            />
          </form>

          <button className={Styles.closeBtn} onClick={close} type="button">
            <svg height="37" viewBox="0 0 512 512" width="37" x="0" y="0">
              <path d="m25 512a25 25 0 0 1 -17.68-42.68l462-462a25 25 0 0 1 35.36 35.36l-462 462a24.93 24.93 0 0 1 -17.68 7.32z" />
              <path d="m487 512a24.93 24.93 0 0 1 -17.68-7.32l-462-462a25 25 0 0 1 35.36-35.36l462 462a25 25 0 0 1 -17.68 42.68z" />
            </svg>
          </button>
        </div>
        <div className={Styles.tags}>
          {tags.map((name) => (
            <button key={name} onClick={() => onTagClick(name)}>
              {name}
            </button>
          ))}
        </div>

        <div className={Styles.list}>
          <ul className={Styles.searchResult}>
            {list.map(({ pathname, title }) => (
              <li key={pathname}>
                <a href={pathname} onClick={close}>
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
