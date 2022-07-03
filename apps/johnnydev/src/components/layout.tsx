import { AppContext } from '../context/app'
import { devices } from '../util'
import Footer from './footer'
import Header from './header'
import Search from './search'
import { ReactNode, useContext } from 'react'
import styled from 'styled-components'

export interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { showSearch } = useContext(AppContext)
  return (
    <>
      <Header />
      <StyledLayout>{children}</StyledLayout>
      <Footer />
      {showSearch ? <Search /> : null}
    </>
  )
}

export default Layout

const StyledLayout = styled.main`
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 9rem auto 0 auto;
  min-height: calc(100vh - 23rem);

  @media ${devices.mobile} {
    margin: 4rem auto 0 auto;
    padding: 2rem 0.5rem;
  }
`
