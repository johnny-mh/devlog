import { useEffect, useState } from 'react'

const COMMENTS_ID = 'comments-container'

export function Comment() {
  useEffect(() => {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const script = document.createElement('script')

    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', 'johnny-mh/devlog')
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

  const [dark, setDark] = useState(false)

  useEffect(() => {
    function onChange(mediaQuery: MediaQueryListEvent) {
      setDark(mediaQuery.matches)
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

    prefersDark.addEventListener('change', onChange)

    return () => {
      prefersDark.removeEventListener('change', onChange)
    }
  }, [])

  useEffect(() => {
    if (document.querySelector('.utterances-frame')) {
      const iframe =
        document.querySelector<HTMLIFrameElement>('.utterances-frame')

      if (!iframe) {
        return
      }

      iframe?.contentWindow?.postMessage(
        { theme: dark ? 'github-dark' : 'github-light', type: 'set-theme' },
        'https://utteranc.es'
      )
    }
  }, [dark])

  return <div id={COMMENTS_ID} />
}
