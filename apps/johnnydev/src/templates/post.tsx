import SEO from '../components/SEO'
import Layout from '../components/layout'
import Pager from '../components/pager'
import Post from '../components/post'
import { graphql } from 'gatsby'
import React from 'react'

export const pageQuery = graphql`
  query ($pageId: String!) {
    post: markdownRemark(id: { eq: $pageId }) {
      ...Post
    }
  }
`
const PostTemplate = ({ data: { post }, pageContext }) => {
  return (
    <Layout>
      <SEO keywords={post.frontmatter.tags} desc={post.frontmatter.title} />
      <Post post={post} />
      <Pager {...pageContext} />
    </Layout>
  )
}

export default PostTemplate
