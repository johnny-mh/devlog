import { ReactComponent as TagIcon } from '../images/tag.svg'
import SEO from './SEO'
import TOC from './toc'
import dayjs from 'dayjs'
import { Link, graphql } from 'gatsby'
import { isEmpty } from 'lodash'
import React from 'react'
import styled from 'styled-components'

export const query = graphql`
  fragment Post on MarkdownRemark {
    id
    html
    frontmatter {
      categories
      tags
      title
      featuredImage {
        publicURL
      }
      description
    }
    fields {
      slug
      date
    }
    timeToRead
    ...TOC
  }
`

export interface PostProps {
  id: string
  html: string
  frontmatter: {
    title: string
    categories: string[]
    tags: string[]
    featuredImage: null | { publicURL: string }
    updatedAt: string
    description: string | null
  }
  fields: {
    slug: string
    date: string
    sortDate: string
  }
  headings: Array<{
    value: string
    depth: number
  }>
  timeToRead: string
}

export function Post(props: { post: PostProps }) {
  const meta = []
  const { post } = props
  const { frontmatter } = post

  if (!isEmpty(frontmatter.tags)) {
    meta.push({
      name: 'keywords',
      content: frontmatter.tags,
    })
  }

  return (
    <StyledPost>
      <TOC headings={post.headings} />
      <header>
        <h1>{post.frontmatter.title}</h1>
        <div className="post-meta">
          <span className="date">
            <time itemProp="datePublished">
              {dayjs(post.fields.date).format('LL')}
            </time>
          </span>
          <span className="categories">
            in{' '}
            {post.frontmatter.categories.map(cat => (
              <Link to={'/post/category/' + cat} rel="tag" key={cat}>
                {cat}
              </Link>
            ))}
          </span>
        </div>
        <div className="tags">
          <TagIcon className="icon-tag" />
          {post.frontmatter.tags.map(tag => (
            <Link to={`/post/tag/${tag}`} rel="tag" key={tag}>
              {tag}
            </Link>
          ))}
        </div>
      </header>
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      ></div>
    </StyledPost>
  )
}

export default Post

const StyledPost = styled.article`
  header {
    display: grid;
    margin-bottom: 35px;

    h1 {
      margin: 0 0 0.5rem;
    }

    .post-meta {
      margin: 0 0 0.5rem;

      * {
        text-transform: uppercase;
        line-height: 1.6em;
        letter-spacing: 1px;
        font-size: 12px;
        color: #a8a8a8;
      }

      span + span {
        padding-left: 5px;
      }

      a:hover {
        color: #333;
      }
    }

    .tags {
      font-size: 0.8em;
      color: #a8a8a8;
      display: flex;
      align-items: center;
      gap: 7px;

      a {
        color: #a8a8a8;

        :hover {
          color: #333;
        }
      }

      .icon-tag {
        display: inline-block;
        margin-right: 4px;
        width: 14px;
        height: 14px;
        margin-top: -4px;
        line-height: inherit;
        vertical-align: middle;
      }
    }
  }
`
