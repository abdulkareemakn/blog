import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { postSlug, visiblePosts } from "@/lib/posts";
import { ogImage } from "@/lib/og";

export async function getStaticPaths() {
  return visiblePosts(await getCollection("posts")).map((post) => ({
    params: { slug: postSlug(post) },
    props: { title: post.data.title },
  }));
}
export const GET: APIRoute = ({ props }) => ogImage(props.title);
