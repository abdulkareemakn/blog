// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import expressiveCode from "astro-expressive-code";
import rehypeSlug from "rehype-slug";
import { siteConfig } from "./src/config/site.ts";

import mdx from "@astrojs/mdx";

export default defineConfig({
  site: siteConfig.siteUrl,
  trailingSlash: "always",
  integrations: [
    expressiveCode(),
    sitemap({
      filter: (page) => page !== new URL("/search/", siteConfig.siteUrl).toString(),
    }),
    mdx(),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeSlug],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
