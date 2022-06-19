import { Link, graphql, useStaticQuery } from "gatsby"
import dayjs from "dayjs"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"

import { ReactComponent as TimeIcon } from "../images/time.svg"

export function PostList() {
  const data = useStaticQuery(graphql`
    query PostList {
      allMarkdownRemark(
        filter: { fields: { type: { eq: "post" } } }
        sort: { fields: fields___date, order: DESC }
        limit: 5
      ) {
        nodes {
          id
          timeToRead
          fields {
            slug
            type
            date
          }
          frontmatter {
            title
          }
        }
      }
    }
  `)

  return (
    <StyledPostList>
      <h3>최근 포스트</h3>
      <ul>
        {data.allMarkdownRemark.nodes.map(post => (
          <li key={post.id}>
            <article>
              <h4 itemProp="headline">
                <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
              </h4>
              <div className="meta">
                <span>{dayjs(post.fields.date).format("LL")}</span>
                <span>
                  <TimeIcon /> {post.timeToRead}분 소요
                </span>
                {post.frontmatter.updatedAt ? (
                  <span className="updated">
                    ※ {dayjs(post.frontmatter.updatedAt).format("M/d")} 업데이트
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

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({ node: PropTypes.any })),
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
            content: "";
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
        font-weight: 700;

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
