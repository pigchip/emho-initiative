# EMHO Initiative

A light, bilingual digital-public-goods showcase built with Vite, React,
TypeScript, and Tailwind CSS. It introduces Chino 100, One-DSA, and DSA Mastery
through actual project screenshots, detail pages, and Markdown articles.

## Development

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, followed by `/emho-initiative/`.
English or Spanish is selected from the browser language and can be changed
in the header. The preference stays on the device.

## Build and publish

```sh
npm run lint
npm run build
npm test
```

The build prerenders every known page into `dist`, plus a not-found page,
sitemap, and metadata. Articles live in `src/articles` with English and
Spanish Markdown versions; their navigation metadata lives in `src/content.ts`.

The Pages workflow publishes this repository independently. The existing
`pigchip/pigchip` deployment also builds and nests this site at
`https://aguzmancruz.com/emho-initiative/`, alongside the existing portfolio,
One-DSA, and Local RAG. No Cloudflare Worker or DNS change is required.

## Assets and claims

The EMHO identity comes from the supplied initiative artwork. Inter and
Playfair Display are bundled locally through Fontsource, under their SIL
Open Font Licenses. Screenshots show the actual project interfaces.

These projects are not presented as certified DPGA registry entries.
Free access and public source do not automatically imply an open-source
license; the site asks readers to check each repository before reuse.
Chino 100 is free to use, but its source remains private and no public source
link is shown for it. Only its compiled website is published.
