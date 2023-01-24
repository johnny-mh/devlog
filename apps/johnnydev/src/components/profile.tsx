import { devices } from '../util'
import { StaticImage } from 'gatsby-plugin-image'
import styled from '@emotion/styled'
import React from 'react'

export function Profile() {
  return (
    <StyledProfile>
      <div className="profile">
        <StaticImage
          src="../images/profile.png"
          alt="johnnydev"
          placeholder="none"
          imgStyle={{ borderRadius: '50%' }}
        />
      </div>
      <div className="description">
        <h1>안녕하세요! FE개발자 김민형입니다</h1>
        <div className="tags">
          {['JavaScript', 'Angular', 'React', 'NodeJS'].map((str) => (
            <span key={str}>{str}</span>
          ))}
        </div>
        <div className="mail">
          <a href="mailto:romz1212@gmail.com">romz1212@gmail.com</a>
        </div>
      </div>
    </StyledProfile>
  )
}

export default Profile

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
    flex-shrink: 0;

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
      word-break: keep-all;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
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

  @media ${devices.mobile} {
    flex-direction: column;
    align-items: center;
    text-align: center;

    .tags {
      margin-left: 0;
      justify-content: center;
      font-size: 0.9rem;
    }

    .description {
      margin: 1rem 0;
      padding: 0;
    }
  }
`
