import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import { test } from "node:test";
import { Script } from "node:vm";
import { join } from "node:path";

const legacy = JSON.parse(await readFile(new URL("./legacy-urls.json", import.meta.url), "utf8"));
const origin = "https://abdulkareem.is-a.dev";

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? htmlFiles(path) : path.endsWith(".html") ? [path] : [];
    }),
  );
  return files.flat();
}

test("migration preserves published URLs, anchors, metadata, and assets", async () => {
  for (const page of legacy) {
    const html = await readFile(join("dist", page.path), "utf8");
    assert.ok(html.includes(`rel="canonical" href="${page.canonical}"`), page.path);
    for (const id of page.headings) assert.ok(html.includes(`id="${id}"`), `${page.path}#${id}`);
  }
  for (const file of await htmlFiles("dist")) {
    const html = await readFile(file, "utf8");
    assert.doesNotMatch(html, /https:\/\/monograph\.xocoweb|href="\/post\//);
    for (const [, attributes, source] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (!attributes.includes('type="') && source.trim()) new Script(source, { filename: file });
      if (attributes.includes('type="application/ld+json"')) {
        const schema = JSON.parse(source);
        assert.equal(schema.publisher["@type"], "Person");
      }
    }
    for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (!value.startsWith("/") || value.startsWith("//")) continue;
      const url = new URL(value, origin);
      const path = decodeURIComponent(url.pathname);
      assert.ok(
        (await exists(join("dist", path))) || (await exists(join("dist", path, "index.html"))),
        `${file}: ${value}`,
      );
    }
    if (html.includes('property="og:type" content="article"')) {
      assert.ok(html.includes('property="article:published_time"'));
      assert.ok(html.includes("data-pagefind-body"));
      const png = await readFile(file.replace(/index\.html$/, "index.png"));
      assert.equal(png.readUInt32BE(16), 1200);
      assert.equal(png.readUInt32BE(20), 630);
    }
  }
  for (const name of await readdir("src/content/posts")) {
    const markdown = await readFile(join("src/content/posts", name), "utf8");
    const frontmatter = markdown.split("---")[1];
    if (/^draft: true$/m.test(frontmatter)) {
      const slug = frontmatter.match(/^slug: (.+)$/m)?.[1] ?? name.replace(/\.mdx?$/, "");
      assert.equal(
        await exists(join("dist/posts", slug, "index.html")),
        false,
        `Draft leaked: ${slug}`,
      );
    }
  }
  const robots = await readFile("dist/robots.txt", "utf8");
  assert.ok(robots.includes(`${origin}/sitemap-index.xml`));
  assert.equal(await exists("dist/sitemap.xml"), false);
  const sitemap = await readFile("dist/sitemap-0.xml", "utf8");
  assert.ok(!sitemap.includes(`${origin}/search/`));
  assert.ok(await exists("dist/pagefind/pagefind.js"));
});
