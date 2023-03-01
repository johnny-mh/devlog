import { throttle } from '#/util/throttle'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'preact/hooks'
import styles from './TOC.module.css'

export function TOC({
  headings,
}: {
  headings: Array<{ depth: number; text: string; slug: string }>
}) {
  const headers = useMemo(() => headings.filter(({ depth }) => depth < 3), [])
  const [currentIndex, setCurrentIndex] = useState<null | number>(null)

  const calcActive = useCallback(() => {
    const offsets: number[] = []

    for (const { slug } of headers) {
      const el = document.getElementById(slug)

      if (!el) {
        return null
      }

      offsets.push(el.offsetTop - 300)
    }

    const maxIndex = offsets.length - 1

    const { scrollY } = window

    let index = 0

    if (scrollY === 0 || scrollY <= offsets[0]) {
      index = 0
    } else if (
      window.innerHeight + scrollY >= document.body.offsetHeight - 30 ||
      scrollY >= (offsets.at(-1) ?? 0)
    ) {
      index = maxIndex
    } else {
      index = offsets.findIndex((offset) => offset > scrollY) - 1
    }
    return index
  }, [headers])

  useEffect(() => {
    setCurrentIndex(calcActive())

    const onScrollForActive = throttle(() => setCurrentIndex(calcActive()), 300)

    window.addEventListener('scroll', onScrollForActive)

    return () => {
      window.removeEventListener('scroll', onScrollForActive)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <ol className={styles.list}>
          {headers.map(({ slug, text, depth }, idx) => (
            <li
              style={`padding-left: ${depth * 11}px`}
              className={currentIndex === idx ? 'active' : ''}
            >
              <a href={`#${slug}`}>{text} </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
