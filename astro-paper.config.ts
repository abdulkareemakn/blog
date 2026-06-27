import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
    site: {
        url: "https://abdulkareem.is-a.dev",
        title: "Abdul Kareem's Blog",
        description: "My personal developer blog where I write about my projects and hobbies.",
        author: "Abdul Kareem",
        profile: "https://abdulkareem.codes",
        ogImage: "default-og.jpg",
        lang: "en",
        timezone: "Asia/Karachi",
        dir: "ltr",
        themeColor: {
            light: "Jade",
            dark: "Espresso",
        },
    },
    posts: {
        perPage: 4,
        perIndex: 4,
        scheduledPostMargin: 15 * 60 * 1000,
    },
    features: {
        lightAndDarkMode: true,
        dynamicOgImage: true,
        showArchives: false,
        showBackButton: true,
        editPost: {
            enabled: false,
            // url: "https://github.com/satnaing/astro-paper/edit/main/",
        },
        search: "pagefind",
    },
    socials: [
        { name: "github", url: "https://github.com/abdulkareemakn" },
        { name: "x", url: "https://x.com/notabdulkareem" },
        { name: "linkedin", url: "https://www.linkedin.com/in/abdul-kareem-nasir/" },
        { name: "mail", url: "mailto:abdulkareemakn@proton.me" },
    ],
    shareLinks: [
        { name: "whatsapp", url: "https://wa.me/?text=" },
        { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
        { name: "x", url: "https://x.com/intent/post?url=" },
        { name: "telegram", url: "https://t.me/share/url?url=" },
        { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
        { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
    ],
});
