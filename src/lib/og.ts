import { readFile } from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";
import { siteConfig } from "@/config/site";

const regular = await readFile("public/fonts/geist/Geist-Regular.ttf");
const bold = await readFile("public/fonts/geist/Geist-Bold.ttf");

export async function ogImage(title: string) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 72,
          background: "#ffffff",
          color: "#17171a",
          fontFamily: "Geist",
          borderTop: "12px solid #1a4fa0",
        },
        children: [
          { type: "div", props: { style: { fontSize: 24 }, children: siteConfig.name } },
          {
            type: "div",
            props: {
              style: {
                fontSize: title.length > 90 ? 52 : 64,
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: -2,
              },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: { fontSize: 24, color: "#1a4fa0" },
              children: new URL(siteConfig.siteUrl).hostname,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
