import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { siteConfig } from "@/config/site";
import { postHref, visiblePosts } from "@/lib/posts";

export const GET: APIRoute = async ({ site }) =>
  rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: site!,
    customData: `<language>${siteConfig.language}</language>`,
    items: visiblePosts(await getCollection("posts")).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDatetime,
      link: postHref(post),
    })),
  });
