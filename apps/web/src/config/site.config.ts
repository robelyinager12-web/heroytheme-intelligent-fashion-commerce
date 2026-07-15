export const siteConfig = {
  name: "HeroyTheme",
  fullName: "HeroyTheme Intelligent Fashion Commerce",
  tagline: "AI-powered fashion, styled for you",
  description:
    "A premium, AI-powered fashion commerce platform — smart recommendations, instant style search, and a shopping experience that adapts to you.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/images/og-cover.jpg",
  links: {
    instagram: "https://instagram.com/heroytheme",
    twitter: "https://twitter.com/heroytheme",
    facebook: "https://facebook.com/heroytheme",
    tiktok: "https://tiktok.com/@heroytheme",
  },
  contact: {
    email: "support@heroytheme.com",
    phone: "+1 (555) 010-2030",
  },
  keywords: [
    "fashion ecommerce",
    "AI shopping assistant",
    "online clothing store",
    "AI outfit recommendation",
    "smart fashion search",
  ],
} as const;

export type SiteConfig = typeof siteConfig;