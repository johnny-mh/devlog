import { AppContext } from '../context/app'
import Footer from './footer'
import Header from './header'
import Search from './search'
import { ReactNode, useState } from 'react'
import styled from 'styled-components'

export interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [search, setSearch] = useState(false)

  return (
    <AppContext.Provider value={{ search, setSearch }}>
      <Header />
      <StyledLayout>{children}</StyledLayout>
      <Footer />
      {search ? <Search /> : null}
    </AppContext.Provider>
  )
}

export default Layout

const StyledLayout = styled.main`
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 9rem auto 0 auto;
  min-height: calc(100vh - 23rem);
`
