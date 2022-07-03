import { AppContext } from '../context/app'
import { ReactComponent as LogoIcon } from '../images/johnnydev.svg'
import { ReactComponent as SearchIcon } from '../images/search.svg'
import { isBrowser } from '../util'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import {
  ReactEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import styled from 'styled-components'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const onScroll = () => isBrowser && setScrolled(window.scrollY > 20)

  useEffect(() => {
    if (isBrowser) {
      window.addEventListener('scroll', onScroll)

      setScrolled(window.scrollY > 20)

      return () => window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const { setShowSearch: setSearch } = useContext(AppContext)

  const onClickSearch = useCallback<ReactEventHandler<HTMLAnchorElement>>(e => {
    e.preventDefault()
    setSearch(true)
  }, [])

  return (
    <StyledHeader className={scrolled ? 'scroll' : ''}>
      <div className="container">
        <div className="brand">
          <Link to="/">
            <LogoIcon width={230} />
          </Link>
        </div>
        <div className="links">
          <Link to="/about">About</Link>
          <Link to="/archives">Archives</Link>
          <a href="#search" onClick={onClickSearch}>
            <SearchIcon width={15} height={13} />
          </a>
        </div>
      </div>
    </StyledHeader>
  )
}

export default Header

const StyledHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  background-color: #fff;

  &.scroll {
    box-shadow: 1px 2px 18px rgba(0, 0, 0, 0.1);

    .container {
      height: 80px;
    }
  }

  .brand {
    a {
      display: block;
      padding: 0.5rem 1rem;
      transition: background-color 0.2s ease-in-out;

      svg {
        fill: #333;
        transition: fill 0.2s ease-in-out;
      }

      &:hover {
        background-color: #333;

        svg {
          fill: #fff;
        }
      }
    }
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 9rem;
    transition: height 80ms ease-out;

    max-width: 800px;
    padding: 0 2rem;
    margin: 0 auto;
  }

  .links {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    height: 100%;

    a {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      margin: 0 0.25rem;
      color: #333;
      line-height: 1.2rem;
      text-align: center;
      text-decoration: none;

      :hover {
        color: #000;
      }
    }

    svg {
      fill: #333;
    }
  }
`
