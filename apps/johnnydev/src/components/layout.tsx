import Footer from './footer'
import Header from './header'
import { ReactNode } from 'react'
import styled from 'styled-components'

export interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <StyledLayout>{children}</StyledLayout>
      <Footer />
    </>
  )
}

export default Layout

const StyledLayout = styled.main`
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 9rem auto 0 auto;
  min-height: calc(100vh - 23rem);
`
