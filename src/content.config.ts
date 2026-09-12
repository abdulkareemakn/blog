import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

export const BLOG_PATH = "src/content/posts";

const canonicalURL = z
  .url()
  .refine((url) => url.startsWith("https://"), "Canonical URL must use HTTPS");
const tags = z
  .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Tags must use lowercase kebab-case"))
  .min(1)
  .refine((values) => new Set(values).size === values.length, "Tags must be unique");

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z
      .object({
        pubDatetime: z.date(),
        modDatetime: z.date().optional(),
        title: z.string(),
        featured: z.boolean().optional(),
        draft: z.boolean().optional(),
        tags,
        cover: z
          .object({
            src: image(),
            alt: z.string(),
            creditName: z.string().optional(),
            creditUrl: z.url().optional(),
          })
          .optional(),
        ogImage: image().or(z.string()).optional(),
        description: z.string(),
        canonicalURL: canonicalURL.optional(),
      })
      .refine(({ pubDatetime, modDatetime }) => !modDatetime || modDatetime >= pubDatetime, {
        message: "Modification date cannot precede publication date",
        path: ["modDatetime"],
      }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: canonicalURL.optional(),
  }),
});

export const collections = { posts, pages };
