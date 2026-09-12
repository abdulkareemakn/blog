import { ogImage } from "@/lib/og";
import { siteConfig } from "@/config/site";
export const GET = () => ogImage(siteConfig.tagline);
