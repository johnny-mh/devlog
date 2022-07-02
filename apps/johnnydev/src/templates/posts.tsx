import SEO from '../components/SEO'
import Layout from '../components/layout'
import Pager from '../components/pager'
import PostList from '../components/post-list'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!, $ids: [String!]) {
    allMarkdownRemark(
      filter: { id: { in: $ids } }
      sort: { fields: [fields___date], order: DESC }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        id
        html
        frontmatter {
          categories
          tags
          title
          featuredImage {
            publicURL
          }
        }
        fields {
          slug
          date
        }
        timeToRead
      }
    }
  }
`

const PostsTemplate = ({
  data: {
    allMarkdownRemark: { edges: posts },
  },
  pageContext,
}) => (
  <Layout>
    <SEO title="post" />
    <PostList posts={posts} />
    <Pager {...pageContext} />
  </Layout>
)

PostsTemplate.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
  pageContext: PropTypes.any,
}

export default PostsTemplate
