import type { RenderedPostEntry } from '#/types'
import type { APIRoute } from 'astro'

import { getPosts } from '#/collection'
import { readFile } from 'fs/promises'
import satori from 'satori'
import { html } from 'satori-html'
import sharp from 'sharp'

export async function getStaticPaths() {
  const posts = await getPosts()

  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }))
}

export const GET: APIRoute<RenderedPostEntry> = async ({ props }) => {
  const [pretendard, spaceGrotesk] = await Promise.all([
    readFile('./src/assets/fonts/Pretendard-SemiBold.ttf'),
    readFile('./src/assets/fonts/SpaceGrotesk-Medium.ttf'),
  ])

  const markup = html(`<div
    style="position:absolute;width:100%;height:100%;display:flex;padding:2rem;background:#000"
  >
    <div
      style="border:3px solid #eee;border-radius:0.5rem;width:100%;height:100%;justify-content:center;align-items:center;display:flex;flex-direction:column"
    >
      <h1
        style="margin:0;text-wrap:balance;letter-spacing:-1px;font-family:Pretendard;font-size:5rem;color:#fff;background:linear-gradient(150deg, #eee, #666);background-clip:text;-webkit-background-clip:text;color:transparent"
      >
        ${props.data.title}
      </h1>
      <div
        style="font-family:SpaceGrotesk;font-size:3rem;position:absolute;right:28;bottom:20;display:flex"
      >
        <div
          style="background:#F5DA55;width:100;height:52;position:absolute;right:-5;bottom:5;display:flex;border-radius:4px;"
        />
        <span style="color:#fff;margin-right:12px">JOHNNY</span
        ><span style="color:#000">DEV</span>
      </div>
    </div>
  </div>`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(markup as any, {
    fonts: [
      { data: pretendard, name: 'Pretendard' },
      { data: spaceGrotesk, name: 'SpaceGrotesk' },
    ],
    height: 630,
    width: 1200,
  })

  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}
