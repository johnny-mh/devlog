import { AppContext } from '../context/app'
import { ReactComponent as CloseIcon } from '../images/close.svg'
import { graphql, useStaticQuery } from 'gatsby'
import { shuffle } from 'lodash'
import React, {
  ReactEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'

export function Search() {
  const {
    allMarkdownRemark: { group },
  } = useStaticQuery(graphql`
    {
      allMarkdownRemark {
        group(field: frontmatter___tags) {
          name: fieldValue
          totalCount
        }
      }
    }
  `)

  const { setSearch } = useContext(AppContext)
  const [reveal, setReveal] = useState('')
  const [searchText, setSearchText] = useState('')
  const inpRef = useRef<HTMLInputElement>()
  const list = useMemo(() => shuffle(group).slice(0, 5), [group])

  const close = useCallback(() => {
    setReveal('')
    inpRef.current.blur()
    setTimeout(() => setSearch(false), 1000)
  }, [setSearch, setReveal])

  const onSubmit = useCallback<ReactEventHandler<HTMLFormElement>>(e => {
    e.preventDefault()
  }, [])

  const onInput = useCallback<ReactEventHandler<HTMLInputElement>>(
    e => setSearchText((e.target as HTMLInputElement).value),
    []
  )

  const onClickTag = useCallback<(searchText: string) => void>(
    name => setSearchText(name),
    []
  )

  useEffect(() => {
    setReveal('reveal')
    inpRef.current.focus()

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keyup', onKeyUp)

    return () => {
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [])

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
              value={searchText}
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
    transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  .inp {
    font-size: 3rem;
    border: none;
    outline: none;
    background-color: transparent;
  }
`
