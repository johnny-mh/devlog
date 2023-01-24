import { AppContext } from '../context/app'
import { ReactComponent as CloseIcon } from '../images/close.svg'
import { devices } from '../util'
import Spinner from './spinner'
import { navigate } from 'gatsby'
import { graphql, useStaticQuery } from 'gatsby'
import { shuffle } from 'lodash'
import React, {
  MouseEvent,
  ReactEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useGatsbyPluginFusejs } from 'react-use-fusejs'
import styled from '@emotion/styled'

interface SearchStaticQuery {
  fusejs: { publicUrl: string }
  allMarkdownRemark: { group: { name: string; totalCount: number }[] }
}

interface SearchItem {
  id: string
  path: string
  title: string
  body: string
}

export function Search() {
  const {
    fusejs: { publicUrl },
    allMarkdownRemark: { group },
  } = useStaticQuery<SearchStaticQuery>(graphql`
    {
      fusejs {
        publicUrl
      }
      allMarkdownRemark {
        group(field: { frontmatter: { tags: SELECT } }) {
          name: fieldValue
          totalCount
        }
      }
    }
  `)

  const { setShowSearch, fuseData, setFuseData } = useContext(AppContext)
  const [reveal, setReveal] = useState('')
  const [query, setQuery] = useState('')
  const results = useGatsbyPluginFusejs<SearchItem>(query, fuseData)

  const inpRef = useRef<HTMLInputElement>(null)
  const list = useMemo(() => shuffle(group).slice(0, 5), [group])

  const [isFething, setIsFetching] = useState(false)

  const close = useCallback(() => {
    setReveal('')
    inpRef.current?.blur()
    setTimeout(() => setShowSearch(false), 1000)
  }, [setShowSearch, setReveal])

  const onSubmit = useCallback<ReactEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault()
  }, [])

  const onInput = useCallback<ReactEventHandler<HTMLInputElement>>(
    (e) => setQuery((e.target as HTMLInputElement).value),
    []
  )

  const onClickTag = useCallback<(searchText: string) => void>((name) => {
    inpRef.current && (inpRef.current.value = name)
    setQuery(name)
  }, [])

  const onClickLink = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, path: string) => {
      e.preventDefault()
      setShowSearch(false)
      navigate(path)
    },
    []
  )

  useEffect(() => {
    setReveal('reveal')
    inpRef.current?.focus()

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keyup', onKeyUp)

    return () => {
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [close])

  const fetchingStore = useRef(false)

  useEffect(() => {
    if (!fetchingStore.current && !fuseData && query) {
      fetchingStore.current = true

      setIsFetching(true)

      fetch(publicUrl)
        .then((res) => res.json())
        .then((data) => setFuseData(data))
        .finally(() => setIsFetching(false))
    }
  }, [fuseData, query, publicUrl, setFuseData])

  return (
    <StyledSearch className={reveal}>
      <div className="content">
        <div className="header">
          <form className="form" onSubmit={onSubmit}>
            <input
              className="inp"
              type="text"
              placeholder="Type to Search"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              ref={inpRef}
              onInput={onInput}
            />
          </form>
          <button className="closeBtn" type="button" onClick={close}>
            <CloseIcon width={25} height={25} />
          </button>
        </div>
        <div className="tags">
          {list.map(({ name }) => (
            <button key={name} onClick={() => onClickTag(name)}>
              {name}
            </button>
          ))}
        </div>
        <div className="list">
          {isFething && <Spinner className="spinner" />}

          {!isFething && query && !results.length ? (
            <p>검색 결과가 없습니다</p>
          ) : (
            <ul className="searchResult">
              {results.map(({ item }) => (
                <li key={item.id}>
                  <a
                    href={item.path}
                    onClick={(e) => onClickLink(e, item.path)}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </StyledSearch>
  )
}

export default Search

const StyledSearch = styled.div`
  position: fixed;
  z-index: 20;
  inset: 0;
  background-color: #f8f8f8;
  overflow-y: scroll;
  overscroll-behavior: none;
  clip-path: circle(0% at 100% 0px);
  transition-property: clip-path;
  transition-duration: 1s;
  transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1);

  .content {
    padding: 4rem 2rem;
    max-width: 800px;
    margin: 9rem auto 0 auto;
    position: relative;
  }

  .closeBtn {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 1.5rem;

    form {
      display: flex;
      flex-grow: 1;
      position: relative;
    }
  }

  .tags {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    margin: 0 0 1.5rem;

    button {
      color: #333;
      background-color: transparent;
      border: 1px solid #888;
      padding: 0.25rem 0.5rem;
      font-family: var(--monospace);
      border-radius: 1rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:hover {
        border-color: #333;
        border-radius: 0.5rem;
      }
    }
  }

  &.reveal {
    clip-path: circle(300% at 100% 0px);
  }

  .inp {
    width: 100%;
    font-size: 3rem;
    border: none;
    outline: none;
    background-color: transparent;
    padding: 0;
  }

  .list {
    position: relative;
    padding-top: 20px;

    ul {
      margin: 0 0 0 0.5rem;

      li {
        position: relative;
        margin-bottom: 1.5rem;

        a {
          color: #333;
        }
      }
    }
  }

  .spinner {
    position: absolute;
    top: -10px;
  }

  @media ${devices.mobile} {
    padding: 0.5rem;

    .content {
      padding: 0;
      margin: 2rem 0 0 0;

      .header {
        input {
          font-size: 2rem;
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }

      .tags {
        gap: 0.5rem;
        flex-wrap: wrap;
      }
    }
  }
`
