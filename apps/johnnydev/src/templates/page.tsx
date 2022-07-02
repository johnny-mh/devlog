import SEO from '../components/SEO'
import Layout from '../components/layout'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
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

const AboutTemplate = ({
  data: {
    markdownRemark: {
      html,
      frontmatter: { title },
    },
  },
}) => {
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

AboutTemplate.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      html: PropTypes.string,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
      }),
    }),
  }),
  pageContext: PropTypes.any,
}

export default AboutTemplate
