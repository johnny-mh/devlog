import React, { useEffect } from 'react'

const COMMENTS_ID = 'comments-container'

export function Comments() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', 'johnny-mh/blog2')
    script.setAttribute('issue-term', 'og:title')
    script.setAttribute('label', 'Comment')
    script.setAttribute('theme', 'github-light')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    const comments = document.getElementById(COMMENTS_ID)

    if (comments) {
      comments.appendChild(script)
    }

    return () => {
      const comments = document.getElementById(COMMENTS_ID)

      if (comments) {
        comments.innerHTML = ''
      }
    }
  }, [])

  return <div id={COMMENTS_ID} />
}

export default Comments
