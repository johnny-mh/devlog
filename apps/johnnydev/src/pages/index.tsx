import SEO from '../components/SEO'
import Layout from '../components/layout'
import PostList from '../components/post-list'
import Profile from '../components/profile'
import { ReactComponent as GatsbyIcon } from '../images/gatsby.svg'
import { ReactComponent as ReactIcon } from '../images/react.svg'
import { ReactComponent as RxjsIcon } from '../images/rxjs.svg'
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import styled from '@emotion/styled'

export function Index() {
  const {
    allMarkdownRemark: { nodes },
  } = useStaticQuery(graphql`
    query PostList {
      allMarkdownRemark(
        filter: { fields: { type: { eq: "post" } } }
        sort: { fields: { date: DESC } }
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
          <li>
            <div className="icon">
              <ReactIcon />
            </div>
            <div className="desc">
              <h4>
                <a
                  href="https://github.com/johnny-mh/blog2/tree/main/libs/react-use-fusejs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  react-use-fusejs
                </a>
              </h4>
              <div>
                <a
                  href="https://fusejs.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fuse.js
                </a>
                를 활용하여 React에서 Fuzzy Search를 구현한 Hook
              </div>
            </div>
          </li>
          <li>
            <div className="icon">
              <GatsbyIcon />
            </div>
            <div className="desc">
              <h4>
                <a
                  href="https://github.com/johnny-mh/blog2/tree/main/libs/gatsby-plugin-fusejs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  gatsby-plugin-fusejs
                </a>
              </h4>
              <div>
                gatsby 데이터 노드를{' '}
                <a
                  href="https://fusejs.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fuse.js
                </a>
                의 index로 변환해주는 플러그인
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
      margin-bottom: 30px;

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
