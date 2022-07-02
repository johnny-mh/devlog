import { ReactComponent as GithubIcon } from '../images/github.svg'
import { ReactComponent as MailIcon } from '../images/mail.svg'
import styled from 'styled-components'

export function Footer() {
  return (
    <StyledFooter className="container">
      <div>
        <a href="/rss.xml" target="_blank">
          RSS
        </a>
      </div>
      <div>
        <a
          href="https://github.com/johnny-mh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon className="github" />
        </a>
        <a href="mailto://romz1212@gmail.com">
          <MailIcon className="mail" />
        </a>
      </div>
    </StyledFooter>
  )
}

export default Footer

const StyledFooter = styled.div`
  margin: 4rem auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 6rem;

  max-width: 800px;
  padding: 0 2rem;

  > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    a {
      color: #333;
      text-decoration: none;

      :hover {
        color: #000;

        svg path {
          fill: #000;
        }
      }
    }
  }

  svg.github {
    width: 24px;
    height: 24px;
  }

  svg.mail {
    width: 20px;
    height: 20px;
  }
`
