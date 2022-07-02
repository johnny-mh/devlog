import SEO from '../components/SEO'
import Layout from '../components/layout'
import { graphql } from 'gatsby'
import React from 'react'

export const pageQuery = graphql`
  query ($id: String) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`

interface AboutTemplateProps {
  data: {
    markdownRemark: {
      html: string
      frontmatter: {
        title: string
      }
    }
  }
  pageContext: any
}

export function AboutTemplate({
  data: {
    markdownRemark: {
      html,
      frontmatter: { title },
    },
  },
}: AboutTemplateProps) {
  return (
    <Layout>
      <SEO title={title} />
      <div
        className={`markdown-content${title === 'about' ? ' about' : ''}`}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </Layout>
  )
}

export default AboutTemplate
