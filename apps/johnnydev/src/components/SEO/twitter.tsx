import React from 'react'
import { Helmet } from 'react-helmet'

export interface TwitterProps {
  type?: string
  username?: string
  title: string
  desc: string
  image: string
}

export function Twitter({
  type = 'summary_large_image',
  username = null,
  title,
  desc,
  image,
}: TwitterProps) {
  return (
    <Helmet>
      {username && <meta name="twitter:creator" content={username} />}
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={desc} />
    </Helmet>
  )
}

export default Twitter
