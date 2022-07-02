import { graphql } from 'gatsby'
import { slug } from 'github-slugger'
import { findIndex, head, last, throttle } from 'lodash'
import React, {
  ReactEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import styled from 'styled-components'

export const query = graphql`
  fragment TOC on MarkdownRemark {
    headings {
      value
      depth
    }
  }
`

export interface TOCProps {
  headings: Array<{
    value: string
    depth: number
  }>
}

export function TOC({ headings }: TOCProps) {
  const headers = useMemo(
    () =>
      headings
        .filter(({ depth }) => depth < 3)
        .map(h => ({ ...h, slug: slug(h.value) })),
    [headings]
  )
  const calcSticky = useCallback(() => window.scrollY >= 100, [])
  const calcActive = useCallback(() => {
    const offsets = headers.map(({ slug }) =>
      Math.max(0, document.getElementById(slug).offsetTop - 300)
    )
    const maxIndex = offsets.length - 1

    const { scrollY } = window

    let index = 0

    if (scrollY === 0 || scrollY <= head(offsets)) {
      index = 0
    } else if (
      window.innerHeight + scrollY >= document.body.offsetHeight - 30 ||
      scrollY >= last(offsets)
    ) {
      index = maxIndex
    } else {
      index = findIndex(offsets, offset => offset > scrollY) - 1
    }
    return index
  }, [headers])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [sticky, setSticky] = useState(calcSticky())

  const onClick = useCallback<ReactEventHandler<HTMLDivElement>>(e => {
    e.preventDefault()

    const target = e.target as HTMLDivElement
    const idx = target.dataset.idx
    const href = target.getAttribute('href')

    if (!href || !idx) {
      return
    }

    const heading = document.querySelector<HTMLHeadingElement>(href)

    if (!heading) {
      return
    }

    window.scrollTo({
      top: heading.offsetTop - 100,
      behavior: 'smooth',
    })
  }, [])

  useEffect(() => {
    setSticky(calcSticky())
    setCurrentIndex(calcActive())

    const onScrollForActive = throttle(() => setCurrentIndex(calcActive()), 300)
    const onScrollForSticky = throttle(() => setSticky(calcSticky()), 10)

    window.addEventListener('scroll', onScrollForActive)
    window.addEventListener('scroll', onScrollForSticky)

    return () => {
      window.removeEventListener('scroll', onScrollForActive)
      window.removeEventListener('scroll', onScrollForSticky)
    }
  }, [calcSticky, calcActive])

  return (
    <StyledToc>
      <div className="wrapper">
        <div className={`content ${sticky ? 'sticky' : ''}`} onClick={onClick}>
          <ol>
            {headers.map(({ value, depth }, idx) => (
              <li
                key={idx}
                style={{ paddingLeft: `${depth * 11}px` }}
                className={currentIndex === idx ? 'active' : ''}
              >
                <a data-idx={idx} href={`#${slug(value)}`}>
                  {value}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </StyledToc>
  )
}

export default TOC

const StyledToc = styled.div`
  width: 100%;
  position: relative;
  font-size: 0.9rem;

  .wrapper {
    position: absolute;
    left: 100%;

    .content {
      width: 240px;
      margin: 0 0 0 5rem;

      ol {
        list-style: none;
        list-style-position: inside;
        line-height: 1.3rem;
        margin: 0;
        padding: 0;

        li {
          border-left: 2px solid #333;
          transition: opacity 0.3s ease;
          opacity: 0.5;

          :hover {
            opacity: 1;
          }
        }

        a {
          color: #333;
          text-decoration: none;
        }

        .active {
          opacity: 1;
          font-weight: 700;
        }
      }

      &.sticky {
        position: fixed;
        top: 100px;
      }
    }
  }
`
