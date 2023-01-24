import { ReactComponent as TimeIcon } from '../images/time.svg'
import { PostProps } from './post'
import React from 'react'
import dayjs from 'dayjs'
import { Link } from 'gatsby'
import styled from '@emotion/styled'

export interface PostListProps {
  title?: string
  posts: PostProps[]
}

export function PostList({ title = '최근 포스트', posts }: PostListProps) {
  return (
    <StyledPostList>
      <h3>{title}</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <article>
              <h4 itemProp="headline">
                <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
              </h4>
              <div className="meta">
                <span>{dayjs(post.fields.date).format('LL')}</span>
                <span>
                  <TimeIcon /> {post.timeToRead}분 소요
                </span>
                {post.frontmatter.updatedAt ? (
                  <span className="updated">
                    ※ {dayjs(post.frontmatter.updatedAt).format('M/d')} 업데이트
                  </span>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </StyledPostList>
  )
}

export default PostList

const StyledPostList = styled.section`
  margin-bottom: 3rem;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      margin-bottom: 0.5rem;
      line-height: 2rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #ebebeb;
      position: relative;

      :last-of-type {
        border-bottom: 1px solid transparent;
      }

      h4 {
        margin: 0;
        padding: 0;

        a {
          color: #333;
          text-decoration: none;

          :hover {
            color: #000;
          }

          :before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
          }
        }
      }

      .meta {
        font-size: 0.8rem;
        color: #a8a8a8;

        svg {
          width: 11px;
          height: 11px;
        }

        span + span {
          padding-left: 11px;
        }

        .updated {
          color: #db4c69;
        }
      }
    }
  }
`
