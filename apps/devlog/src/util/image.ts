import type { GetImageResult, UnresolvedImageTransform } from 'astro'
import type { CollectionEntry } from 'astro:content'

import { getImage } from 'astro:assets'

export const getPostImages = (
  posts: CollectionEntry<'post'>[],
  options?: Omit<UnresolvedImageTransform, 'src'>
) => {
  return Promise.all(
    posts.reduce<Promise<GetImageResult>[]>((arr, post) => {
      const obj = getPostImage(post, options)

      if (!obj) {
        return arr
      }

      return [...arr, obj]
    }, [])
  )
}

export const getPostImage = (
  post: CollectionEntry<'post'>,
  options?: Omit<UnresolvedImageTransform, 'src'>
) => {
  const {
    data: { cover },
  } = post

  if (!cover) {
    return null
  }

  return getImage({ format: 'webp', src: cover, width: 1080, ...options })
}
