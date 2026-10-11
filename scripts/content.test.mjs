// Checks the hand-edited config, so a typo fails here rather than on the site.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (name) => JSON.parse(readFileSync(new URL(`../content/${name}`, import.meta.url), 'utf8'))
const config = read('categories.json')
const overrides = read('overrides.json')
const slugs = config.categories.map((category) => category.slug)

test('categories.json only refers to categories that exist', () => {
  for (const slug of [config.default, ...config.priority, ...Object.values(config.tags)]) {
    assert.ok(slugs.includes(slug), `unknown category "${slug}"`)
  }
  for (const tag of Object.keys(config.tags)) {
    assert.equal(tag, tag.toLowerCase(), `tag "${tag}" must be lower case`)
  }
})

test('overrides.json uses known settings and categories', () => {
  const settings = ['category', 'date', 'summary', 'hidden', 'images', 'imageNotes', 'sync']
  for (const [post, override] of Object.entries(overrides)) {
    for (const key of Object.keys(override)) {
      assert.ok(settings.includes(key), `${post}: unknown setting "${key}"`)
    }
    for (const [image, note] of Object.entries(override.imageNotes ?? {})) {
      assert.match(image, /^(default|[1-9]\d*)$/, `${post}: imageNotes key "${image}" must be a number or "default"`)
      assert.equal(typeof note, 'string', `${post}: image note ${image} must be text`)
    }
    if ('category' in override) {
      assert.ok(slugs.includes(override.category), `${post}: unknown category "${override.category}"`)
    }
  }
})
