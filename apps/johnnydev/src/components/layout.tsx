import React from "react"
import styled from "styled-components"
import Footer from "./footer"
import Header from "./header"

export interface LayoutProps {
  children?: React.ReactNode
}

export function Layout({ children }) {
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
