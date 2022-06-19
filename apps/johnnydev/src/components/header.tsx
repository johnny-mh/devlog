import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { useEffect, useState } from "react"
import styled from "styled-components"

/* eslint-disable-next-line */
export interface HeaderProps {}

export function Header(props: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const onScroll = () => setScrolled(window.scrollY > 20)

  useEffect(() => {
    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  })

  return (
    <StyledHeader className={scrolled ? "scroll" : ""}>
      <div className="container">
        <div className="brand">
          <Link to="/">
            <StaticImage
              src="../images/black.png"
              className="logo"
              alt="JOHNNY DEV"
            />
          </Link>
        </div>
        <div className="links">
          <Link to="/about">About</Link>
          <Link to="/archives">Archives</Link>
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

  .logo img {
    width: 80px;
    height: 80px;
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
  }
`
