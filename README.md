# Abdul Kareem's Blog

Monograph's Astro foundation, adapted for this single-author blog. Product decisions
and deferred integrations are recorded in [PRODUCT.md](PRODUCT.md). Tasks belong in
Todoist under `blog/dev`.

## Local development

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Full-text search is generated during the production build. To test search and OG
images, use the built preview:

```sh
pnpm build
pnpm preview
```

Run `pnpm release:check` for Astro diagnostics, Oxlint, Oxfmt, a production build,
and the URL/metadata regression check. The test's legacy URL inventory was captured
from the existing AstroPaper build before migration; deployment verification against
the live domain is still required before launch.

## Authoring

Existing Markdown, slugs, and media paths are retained. Frontmatter follows the
single-author format recorded in `PRODUCT.md`; site identity lives in
`src/config/site.ts`.
Posts use `/posts/<slug>/`; archive and tag pagination keep four posts per page to
preserve existing page URLs. Numeric article slugs are reserved for pagination.
Drafts are excluded; future-dated non-drafts publish immediately.

Monograph's `Callout`, `CodeGroup`, and `CodeGroupItem` are registered for MDX.
Package-manager examples use explicitly authored variants. Detailed code-block
formatting uses Expressive Code with opt-in titles and line numbers; untitled
blocks keep Copy overlaid in the upper-right without a separate toolbar row.

OG images are generated at build time with Satori, Sharp, and bundled Geist TTFs.
Existing `ogImage` overrides take precedence in social metadata. No font download is
needed during a build. Fonts and theme assets retain their licenses.

Comments use the original Giscus repository, Announcements category, and pathname
mapping so existing discussions stay associated with their posts. The embed follows
the reader’s selected light/dark mode. No additional package is required.

## Tooling limits

Oxfmt runs only on native formats with embedded formatting disabled. Markdown,
MDX, HTML, and Astro files are excluded, preserving content and avoiding its bundled
Prettier-backed formatters. Oxlint checks supported scripts; it does not provide
Astro template linting. `astro check` validates Astro templates and types.
See [Oxc language support](https://oxc.rs/docs/guide/usage/formatter/language-support)
and [compatibility](https://oxc.rs/compatibility).

This is a migration preview. Analytics and Search Console integration are
deferred; do not replace the live site until required launch integrations and
URL behavior have been verified.
