import { StaticImage } from "gatsby-plugin-image"
import React from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import PostList from "../components/post-list"

import { ReactComponent as RxjsIcon } from "../images/rxjs.svg"

export function Index() {
  return (
    <Layout>
      <StyledProfile>
        <div className="profile">
          <StaticImage
            src="../images/profile.png"
            alt="johnnydev"
            placeholder="none"
            quality={100}
            draggable={false}
          />
        </div>
        <div className="description">
          <h1>안녕하세요! FE개발자 김민형입니다</h1>
          <div className="tags">
            {["JavaScript", "Angular", "React", "NodeJS"].map(str => (
              <span key={str}>{str}</span>
            ))}
          </div>
          <div className="mail">
            <a href="mailto://romz1212@gmail.com">romz1212@gmail.com</a>
          </div>
        </div>
      </StyledProfile>
      <PostList />
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

const StyledProfile = styled.section`
  display: flex;
  justify-content: left;
  margin-bottom: 3rem;

  .profile {
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 8.75rem;
    height: 8.75rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 8rem;
      height: 8rem;
      border-radius: 50%;
    }
  }

  .description {
    padding: 1rem 0;
    margin-left: 1rem;
    line-height: 2rem;

    h1 {
      margin-bottom: 1rem;
    }

    .tags {
      display: flex;
      gap: 0.5rem;
      margin-left: 0.5rem;
      margin-bottom: 1rem;

      span {
        line-height: 1.5rem;
        border-radius: 1.5rem;
        background-color: #555;
        color: #fff;
        padding: 0.1rem 1rem;
      }
    }

    .mail {
      margin-left: 0.5rem;
      line-height: 1rem;
      a {
        color: #333;
        text-decoration: none;

        :hover {
          color: #000;
        }
      }
    }
  }
`

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
            content: "";
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
