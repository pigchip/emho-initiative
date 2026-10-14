import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('production article deep links contain rendered content and canonical metadata', async () => {
  const html = await readFile('dist/blog/knowledge-should-be-a-shared-resource/index.html', 'utf8')
  assert.match(html, /Knowledge should be a shared resource/)
  assert.match(html, /Open code needs clear rights/)
  assert.match(html, /rel="canonical" href="https:\/\/aguzmancruz.com\/emho-initiative\/blog\/knowledge-should-be-a-shared-resource\/"/)
  assert.doesNotMatch(html, /<div id="root"><\/div>/)
})

test('all project detail routes expose distinct public app destinations', async () => {
  for (const [slug, live] of [['chino-100', 'chino-100/'], ['one-dsa', 'one-dsa/'], ['dsa-mastery', 'one-dsa/dsa-mastery/']]) {
    const html = await readFile(`dist/projects/${slug}/index.html`, 'utf8')
    assert.ok(html.includes(`href="https://aguzmancruz.com/${live}"`))
    if (slug === 'chino-100') {
      assert.doesNotMatch(html, /github\.com\/pigchip\/chino/)
      assert.match(html, /source repository remains private/)
    } else assert.match(html, /Explore the code/)
  }
  const missing = await readFile('dist/404.html', 'utf8')
  assert.match(missing, /name="robots" content="noindex"/)
})
