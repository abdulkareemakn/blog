# Blog product decisions

These migration decisions supersede the comparison audit. Monograph is the new
foundation; the current AstroPaper blog remains the reference for published URLs
and existing content. Implementation status is recorded below; deferred integrations remain outstanding.
Task tracking belongs in Todoist under `blog/dev`, using `feature`, `chore`,
`refactor`, and `fix` labels.

## Accepted direction

- Use Monograph's presentation and package-manager command examples/CodeGroup
  approach. Do not port the blog's automatic npm command conversion.
- Provide a desktop-only article table of contents. Known limitation: no TOC on
  mobile or narrow screens. The migrated blog shows TOC at 1280px and wider; narrower screens omit it.
- Keep Monograph's draft-only publishing model. Scheduling is not required;
  future-dated non-draft posts are public.
- Generate per-post OG images using local fonts, without a remote font build
  dependency. A post `ogImage` overrides the generated card; `cover` is an
  independent article image and is never used as an implicit OG fallback.
- Treat the site as a single-author personal blog. Use shared author identity;
  multiple-author archives and repeated author profiles are unnecessary.
- Use oxfmt for formatting and oxlint for linting. Do not retain or introduce
  Biome, Prettier, ESLint, or another formatter/linter. Oxfmt runs only on its native formats, with embedded formatting disabled.
  Astro templates use `astro check`; no fallback formatter/linter is configured.
- Remove Monograph's custom sitemap wrapper and use the maintained sitemap
  integration, with robots.txt referencing its generated sitemap index.
- Render code blocks with Expressive Code using GitHub light and dark syntax
  themes. Titles and line numbers remain opt-in, Copy overlays untitled blocks
  without adding a toolbar row, and CodeGroup variants remain manually authored.

## Integration and decision status

- Re-add comments and analytics separately rather than porting their integrations.
- Configure Google Search Console verification and appropriate head metadata.
  Domain properties require DNS verification; HTML head verification applies to
  URL-prefix properties. See [Google's verification documentation](https://support.google.com/webmasters/answer/9008080).
- RSS is implemented with `@astrojs/rss` at `/rss.xml`, with feed discovery in
  the document head and published article URLs preserved.
- Frontmatter and tag normalization are complete. Article bodies and media paths
  remain unchanged apart from the Arch guide additions. Categories are not used;
  discovery and related posts use tags and Pagefind full-text search.

## Routing implemented for migration

The migration preserves the published domain and `/posts/<slug>` article URLs. Adapt Monograph's
article route and link generation to those URLs. Preserve actual existing slug
values, nested path segments, canonical overrides, and the live trailing-slash
behavior; do not infer them solely from the audit's example URLs.

Keep the archive at `/posts/` and pagination at `/posts/2/` where compatible.
Check the published URL inventory for collisions, especially numeric article
slugs, before finalizing the route implementation. Canonical metadata, internal
links, sitemap entries, and RSS links must agree on article URLs.

Before launch, compare the old published URL inventory against the generated site
and check existing heading anchors and linked assets. Any unavoidable URL change
needs an explicit permanent redirect to its matching destination. The implementation keeps `/posts/<slug>/` as the canonical route.
The existing generated URL and heading inventory is covered by `pnpm test`.
Live-domain and deployment redirect checks remain a launch requirement.

## Current implementation

The Monograph foundation runs in `~/code/blog`. Article bodies remain unchanged,
including the pre-existing Arch guide edits.
Existing tags and Pagefind full-text search are retained during this phase; categories
are not introduced. Related posts currently use shared tags. The author comes from
site configuration. TOC is desktop-only, and
OG cards use local Geist fonts. Existing `ogImage` overrides remain effective.

## Post frontmatter

Post frontmatter uses `title`, `description`, UTC ISO 8601 `pubDatetime`, and at
least one lowercase kebab-case tag. `modDatetime` is added only for a meaningful
content update and cannot precede publication. Optional `slug` values exist only
to preserve published URLs; Astro consumes this reserved field before schema
validation. `featured` and `draft` are written only when true.

The optional `cover` object contains `src`, `alt`, and optional credit name and URL.
`ogImage` independently overrides the generated social card. `canonicalURL` is an
absolute HTTPS override used only when another URL is genuinely canonical. Author,
category, edit-link, and per-post timezone fields are intentionally absent.

The old comments, analytics, and Search Console verification have not been carried
forward. RSS has been rebuilt with Astro's maintained integration and preserves the
published post URLs. The remaining items are deferred launch work. Do not deploy this
preview over the live blog yet. The remaining migration follow-ups are tracked in
[Todoist: Blog / Dev](https://app.todoist.com/app/section/dev-6hVV26FJ5HpfCh3W),
using `feature`, `chore`, `refactor`, and `fix`. Frontmatter, Markdown migration,
taxonomy, RSS, and Oxfmt tasks have been completed; code-block discussion, comments,
analytics, Search Console, and live URL verification remain open.
