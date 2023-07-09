import { useEffect } from 'preact/hooks'

const COMMENTS_ID = 'comments-container'

export function Comment() {
  useEffect(() => {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', 'johnny-mh/blog2')
    script.setAttribute('issue-term', 'og:title')
    script.setAttribute('label', 'Comment')
    script.setAttribute('theme', dark ? 'github-dark' : 'github-light')
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
