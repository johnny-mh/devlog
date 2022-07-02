import SEO from '../components/SEO'
import Layout from '../components/layout'
import Pager from '../components/pager'
import { PostProps } from '../components/post'
import PostList from '../components/post-list'
import { graphql } from 'gatsby'
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
        ...Post
      }
    }
  }
`

interface PostsTemplateProps {
  data: { allMarkdownRemark: { nodes: PostProps[] } }
  pageContext: any
}

export function PostsTemplate({
  data: {
    allMarkdownRemark: { nodes: posts },
  },
  pageContext,
}: PostsTemplateProps) {
  return (
    <Layout>
      <SEO title="post" />
      <PostList title={pageContext.title || '최근 포스트'} posts={posts} />
      <Pager {...pageContext} />
    </Layout>
  )
}

export default PostsTemplate
