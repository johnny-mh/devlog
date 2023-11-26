import _rehypePrettyCode from 'rehype-pretty-code'

const prettyCodeOptions = {
  theme: 'nord',
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [
        {
          type: 'text',
          value: ' ',
        },
      ]
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push('highlighted')
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ['word']
  },
  tokensMap: {},
}

export const rehypePrettyCode = [_rehypePrettyCode, prettyCodeOptions]
