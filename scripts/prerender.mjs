import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { base, render, routes } from '../.prerender/entry-server.js'

const template = await readFile('dist/index.html', 'utf8')
const escape = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
for (const path of [...routes, '404/']) {
  const page = render(path)
  const canonical = `https://aguzmancruz.com${base}${path === '404/' ? '' : path}`
  const output = template.replace('<div id="root"></div>', `<div id="root">${page.html}</div>`)
    .replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace('</head>', `<meta name="description" content="${escape(page.description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:type" content="${path.startsWith('blog/') && path !== 'blog/' ? 'article' : 'website'}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://aguzmancruz.com${base}images/emho-wordmark.webp">${path === '404/' ? '<meta name="robots" content="noindex">' : ''}</head>`)
  const file = path === '404/' ? 'dist/404.html' : join('dist', path, 'index.html')
  await mkdir(join(file, '..'), { recursive: true })
  await writeFile(file, output)
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(path => `<url><loc>https://aguzmancruz.com${base}${path}</loc></url>`).join('')}</urlset>`)
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: https://aguzmancruz.com${base}sitemap.xml\n`)
await rm('.prerender', { recursive: true, force: true })
console.log(`Prerendered ${routes.length} routes and the not-found page.`)
