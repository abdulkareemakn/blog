import type { CollectionEntry } from "astro:content";
import { siteConfig } from "@/config/site";
import { slugifyStr } from "@/utils/slugify";

export type Post = CollectionEntry<"posts">;

// Keep AstroPaper's path calculation until content migration is agreed.
export const postSlug = (post: Post) => {
  const directories = (post.filePath?.replace("src/content/posts", "").split("/") ?? [])
    .filter((part) => part && !part.startsWith("_"))
    .slice(0, -1)
    .map(slugifyStr);
  return [...directories, post.id.split("/").at(-1)].join("/");
};
export const postHref = (post: Post) => `/posts/${postSlug(post)}/`;
export const tagHref = (tag: string) => `/tags/${slugifyStr(tag)}/`;
export const byNewest = (a: Post, b: Post) =>
  b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime();
export const visiblePosts = (posts: Post[]) =>
  posts.filter((post) => !post.data.draft).sort(byNewest);

export const readingLabel = (post: Post) => {
  const words = (post.body ?? "").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
};

export const getFeatured = (posts: Post[], limit = 5) =>
  visiblePosts(posts)
    .filter((post) => post.data.featured)
    .slice(0, limit);

export const getTagList = (posts: Post[]) => {
  const tags = new Map<string, { name: string; slug: string; count: number }>();
  for (const post of visiblePosts(posts)) {
    const uniqueTags = new Map(post.data.tags.map((name) => [slugifyStr(name), name]));
    for (const [slug, name] of uniqueTags) {
      const tag = tags.get(slug) ?? { name, slug, count: 0 };
      tag.count++;
      tags.set(slug, tag);
    }
  }
  return [...tags.values()].sort((a, b) => a.slug.localeCompare(b.slug));
};

export const getRelated = (posts: Post[], current: Post, limit = 3) => {
  const tags = new Set(current.data.tags.map(slugifyStr));
  const overlaps = (post: Post) => post.data.tags.some((tag) => tags.has(slugifyStr(tag)));
  return visiblePosts(posts)
    .filter((post) => post.id !== current.id)
    .sort((a, b) => Number(overlaps(b)) - Number(overlaps(a)) || byNewest(a, b))
    .slice(0, limit);
};

export const getAdjacent = (posts: Post[], current: Post) => {
  const ordered = visiblePosts(posts);
  const index = ordered.findIndex((post) => post.id === current.id);
  return {
    newer: index > 0 ? ordered[index - 1] : undefined,
    older: index >= 0 ? ordered[index + 1] : undefined,
  };
};

export const formatDate = (date: Date, style: "short" | "long" = "short") =>
  new Intl.DateTimeFormat(siteConfig.dateLocale, {
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
    timeZone: siteConfig.timezone,
  }).format(date);
