import getColors from 'get-image-colors'
import { resolve } from 'node:path'
import sharp from 'sharp'

export function coverColor() {
  return async function (tree, vfile) {
    const cover = vfile.data.astro.frontmatter.cover

    if (!cover) {
      return
    }

    const imagePath = resolve(vfile.dirname, cover)

    const buf = await sharp(imagePath).raw().jpeg().toBuffer()
    const colors = await getColors(buf, 'image/jpeg')

    colors.sort((a, b) => {
      a = a.rgb()
      b = b.rgb()

      const brightnessA = a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
      const brightnessB = b[0] * 0.2126 + b[1] * 0.7152 + b[2] * 0.0722

      return brightnessB - brightnessA
    })

    vfile.data.astro.frontmatter.coverColors = colors.map((color) =>
      color.hex()
    )
  }
}
