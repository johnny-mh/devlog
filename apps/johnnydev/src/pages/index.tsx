import SEO from '../components/SEO'
import Layout from '../components/layout'
import PostList from '../components/post-list'
import Profile from '../components/profile'
import { ReactComponent as RxjsIcon } from '../images/rxjs.svg'
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

export function Index() {
  const {
    allMarkdownRemark: { nodes },
  } = useStaticQuery(graphql`
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
    <Layout>
      <SEO />
      <Profile />
      <PostList posts={nodes} />
      <StyledOpensource>
        <h3>오픈소스 프로젝트</h3>
        <ul className="opensources">
          <li>
            <div className="icon">
              <RxjsIcon />
            </div>
            <div className="desc">
              <h4>
                <a
                  href="https://github.com/johnny-mh/rxjs-shell"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  rxjs-shell
                </a>
                <img
                  className="travis"
                  src="https://github.com/johnny-mh/rxjs-shell/actions/workflows/pull_request.yml/badge.svg"
                  alt="CI"
                  draggable={false}
                />
              </h4>
              <div>
                NodeJS의 child_process를 rxjs의 operator로 사용할 수 있게 해
                주는 패키지
              </div>
            </div>
          </li>
        </ul>
      </StyledOpensource>
    </Layout>
  )
}

export default Index

const StyledOpensource = styled.section`
  .opensources {
    margin: 0;
    padding: 0;

    li {
      display: flex;
      position: relative;

      h4 {
        margin-bottom: 0.5rem;
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

      .icon {
        display: flex;
        width: 56px;
        height: 56px;

        svg {
          width: 56px;
          height: 56px;
        }
      }

      .desc {
        margin-left: 21px;

        .travis {
          padding-left: 11px;
          vertical-align: middle;
        }
      }
    }
  }
`
