import SEO from '../components/SEO'
import Comments from '../components/comments'
import Layout from '../components/layout'
import Pager from '../components/pager'
import Post, { PostProps } from '../components/post'
import { graphql } from 'gatsby'
import React from 'react'

export const pageQuery = graphql`
  query ($pageId: String!) {
    post: markdownRemark(id: { eq: $pageId }) {
      ...Post
    }
  }
`

interface PostTemplateProps {
  data: {
    post: PostProps
  }
  pageContext: any
}

export function PostTemplate({
  data: { post },
  pageContext,
}: PostTemplateProps) {
  return (
    <Layout>
      <SEO
        keywords={post.frontmatter.tags}
        title={post.frontmatter.title}
        desc={post.frontmatter.description ?? undefined}
        image={post.frontmatter.featuredImage?.publicURL}
      />
      <Post post={post} />
      <Pager {...pageContext} />
      <Comments />
    </Layout>
  )
}

export default PostTemplate
