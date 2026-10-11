import assert from 'node:assert/strict'
import { test } from 'node:test'
import { htmlToMarkdown } from './convert.mjs'

const image =
  '<div class="captioned-image-container"><figure><a class="image-link" href="big.png">' +
  '<div><picture><source srcset="x.webp"><img src="x.png" alt="A chat"></picture></div></a>' +
  '<figcaption>caption</figcaption></figure></div>'

test('strips subscribe widgets', () => {
  const markdown = htmlToMarkdown(
    '<p>Words.</p>' +
      '<div class="subscription-widget-wrap-editor"><form><input type="submit" value="Subscribe"></form></div>',
  )
  assert.equal(markdown, 'Words.\n')
})

test('leaves a numbered marker where each image was', () => {
  const markdown = htmlToMarkdown(image + '<p>Words.</p>' + image)
  assert.equal(markdown, '{{image-1}}\n\nWords.\n\n{{image-2}}\n')
})

test('keeps images when a post opts in', () => {
  const markdown = htmlToMarkdown(image + '<p>Words.</p>', { keepImages: true })
  assert.equal(markdown, '![A chat](x.png)\n\n_caption_\n\nWords.\n')
})

test('marks a bare linked image without leaving an empty link', () => {
  assert.equal(
    htmlToMarkdown('<p>Look:</p><a href="x.png"><img src="x.png"></a><p><a href="y"></a>End.</p>'),
    'Look:\n\n{{image-1}}\n\nEnd.\n',
  )
})

test('converts footnotes to markdown footnotes', () => {
  const markdown = htmlToMarkdown(
    '<p>Taste.<a class="footnote-anchor" id="footnote-anchor-12" href="#footnote-12">12</a></p>' +
      '<div class="footnote"><a id="footnote-12" href="#footnote-anchor-12" class="footnote-number">12</a>' +
      '<div class="footnote-content"><p>First.</p><p>Second.</p></div></div>',
  )
  assert.equal(markdown, 'Taste.[^12]\n\n[^12]: First.\n\n    Second.\n')
})

test('converts pullquotes to blockquotes', () => {
  assert.equal(htmlToMarkdown('<div class="pullquote"><p>Quoted.</p></div>'), '> Quoted.\n')
})

test('keeps tags mentioned in prose as text', () => {
  assert.equal(
    htmlToMarkdown('<p>Use the &lt;div&gt; tag, R&amp;D, and &amp;amp; too.</p>'),
    'Use the &lt;div> tag, R&D, and &amp;amp; too.\n',
  )
})

test('turns double line breaks into paragraphs and trims outer rules', () => {
  assert.equal(
    htmlToMarkdown('<div><hr></div><p>One.<br><br>Two.</p><p><br>Three.</p><div><hr></div>'),
    'One.\n\nTwo.\n\nThree.\n',
  )
})

test('replaces video embeds with a link', () => {
  assert.equal(
    htmlToMarkdown('<p>Watch:</p><iframe src="https://www.youtube-nocookie.com/embed/abc_123?rel=0"></iframe>'),
    'Watch:\n\n[https://www.youtube.com/watch?v=abc_123](https://www.youtube.com/watch?v=abc_123)\n',
  )
})
