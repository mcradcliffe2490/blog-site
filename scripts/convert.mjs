import TurndownService from 'turndown'

const hasClass = (node, name) =>
  node.nodeType === 1 && (node.getAttribute('class') || '').split(/\s+/).includes(name)

const IMAGE_CONTAINER = 'captioned-image-container'

// Substack-only furniture that has no place on the site: subscribe forms and
// call-to-action buttons.
const STRIPPED_CLASSES = ['subscription-widget-wrap', 'subscription-widget-wrap-editor', 'button-wrapper']
const STRIPPED_TAGS = ['FORM', 'BUTTON', 'SVG']

const insideImageContainer = (node) => {
  for (let parent = node.parentNode; parent; parent = parent.parentNode) {
    if (hasClass(parent, IMAGE_CONTAINER)) return true
  }
  return false
}

function embedUrl(src) {
  const youtube = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/)
  return youtube ? `https://www.youtube.com/watch?v=${youtube[1]}` : src
}

function createConverter({ keepImages }) {
  let imageCount = 0
  const turndown = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    emDelimiter: '_',
  })

  // Turndown leaves `<` and entity-like `&` alone, so prose such as "the <div>
  // tag" would come back out of the markdown renderer as a real tag.
  const escapeMarkdown = turndown.escape.bind(turndown)
  turndown.escape = (text) =>
    escapeMarkdown(text)
      .replace(/&(?=#?\w+;)/g, '&amp;')
      .replace(/<(?=[a-zA-Z/!?])/g, '&lt;')

  turndown.addRule('stripSubstackFurniture', {
    filter: (node) =>
      STRIPPED_TAGS.includes(node.nodeName.toUpperCase()) ||
      STRIPPED_CLASSES.some((name) => hasClass(node, name)),
    replacement: () => '',
  })

  // The site is text-only on purpose. Unless a post opts in to pictures, each
  // one leaves a numbered marker that the site swaps for a line of text.
  turndown.addRule('imageMarker', {
    filter: (node) =>
      !keepImages &&
      (hasClass(node, IMAGE_CONTAINER) || (node.nodeName === 'IMG' && !insideImageContainer(node))),
    replacement: () => `\n\n{{image-${++imageCount}}}\n\n`,
  })

  turndown.addRule('captionedImage', {
    filter: (node) => keepImages && hasClass(node, IMAGE_CONTAINER),
    replacement: (_, node) => {
      const image = node.querySelector('img')
      if (!image) return ''
      const caption = node.querySelector('figcaption')?.textContent.trim()
      const markdown = `![${image.getAttribute('alt') || ''}](${image.getAttribute('src')})`
      return `\n\n${markdown}${caption ? `\n\n_${caption}_` : ''}\n\n`
    },
  })

  // A link with no text only wrapped an image; keep whatever the image became.
  turndown.addRule('imageLink', {
    filter: (node) =>
      node.nodeName === 'A' &&
      !node.textContent.trim() &&
      !(keepImages && node.querySelector('img')),
    replacement: (content) => content,
  })

  turndown.addRule('embed', {
    filter: 'iframe',
    replacement: (_, node) => {
      const src = node.getAttribute('src')
      return src ? `\n\n[${embedUrl(src)}](${embedUrl(src)})\n\n` : ''
    },
  })

  turndown.addRule('footnoteReference', {
    filter: (node) => node.nodeName === 'A' && hasClass(node, 'footnote-anchor'),
    replacement: (content) => `[^${content.trim()}]`,
  })

  turndown.addRule('footnoteDefinition', {
    filter: (node) => node.nodeName === 'DIV' && hasClass(node, 'footnote'),
    replacement: (content) => {
      // The number link comes first, then the footnote body.
      const match = content.trim().match(/^\[?(\d+)\]?(?:\([^)]*\))?\s*([\s\S]*)$/)
      if (!match) return `\n\n${content}\n\n`
      const body = match[2].trim().replace(/\n(?=[^\n])/g, '\n    ')
      return `\n\n[^${match[1]}]: ${body}\n\n`
    },
  })

  turndown.addRule('pullquote', {
    filter: (node) => node.nodeName === 'DIV' && hasClass(node, 'pullquote'),
    replacement: (content) => `\n\n> ${content.trim().replace(/\n/g, '\n> ')}\n\n`,
  })

  return turndown
}

export function htmlToMarkdown(html, { keepImages = false } = {}) {
  return (
    createConverter({ keepImages })
      .turndown(html)
      // Two or more <br> in a row were meant as a paragraph break, and a lone
      // one at the start of a paragraph is left over from a removed image.
      .replace(/(?: {2}\n){2,}/g, '\n\n')
      .replace(/\n\n {2}\n/g, '\n\n')
      .replace(/^[ \t]+$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      // A rule at the very top or bottom separates nothing.
      .replace(/^(?:\s*---\s*\n)+/, '')
      .replace(/(?:\n\s*---\s*)+$/, '')
      .trim() + '\n'
  )
}
