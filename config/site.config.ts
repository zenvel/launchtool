/**
 * Site Configuration
 *
 * Centralized configuration for your tool website.
 * Update these values to customize your site.
 */

export const siteConfig = {
  // Basic Info
  name: "LaunchTool",
  title: "LaunchTool - Launch Your Web Tool in Minutes",
  description: "The fastest way to launch SEO-friendly tool websites with Next.js. Built-in i18n, blog system, and 56+ UI components.",

  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",

  // Author/Organization
  author: {
    name: "Your Name",
    url: "https://yourwebsite.com",
    email: "hello@yourdomain.com",
  },

  // Social Links (optional - remove if not needed)
  social: {
    twitter: "https://twitter.com/yourusername",
    github: "https://github.com/yourusername/your-tool",
    // linkedin: "https://linkedin.com/in/yourprofile",
    // youtube: "https://youtube.com/@yourchannel",
  },

  // Navigation
  navigation: {
    main: [
      { name: "Features", href: "/features" },
      { name: "Blog", href: "/blog" },
      { name: "Pricing", href: "/pricing" },
      { name: "About", href: "/about" },
    ],
    footer: [
      {
        title: "Product",
        links: [
          { name: "Features", href: "/features" },
          { name: "Pricing", href: "/pricing" },
          { name: "Help Center", href: "/help-center" },
        ],
      },
      {
        title: "Company",
        links: [
          { name: "About", href: "/about" },
          { name: "Blog", href: "/blog" },
          { name: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Legal",
        links: [
          { name: "Privacy Policy", href: "/privacy-policy" },
          { name: "Terms of Service", href: "/terms-of-service" },
        ],
      },
    ],
  },

  // SEO & Meta
  meta: {
    ogImage: "/og-image.png", // 1200x630px recommended
    twitterCard: "summary_large_image",
    keywords: [
      "your tool",
      "web tool",
      "online tool",
      "free tool",
      // Add your specific keywords
    ],
  },

  // Features (display on homepage)
  features: [
    {
      icon: "ShieldCheck",
      title: "Privacy First",
      description: "All processing happens in your browser. Your data never leaves your device.",
    },
    {
      icon: "Zap",
      title: "Lightning Fast",
      description: "Built with Next.js 15 and Edge Runtime for instant processing.",
    },
    {
      icon: "Globe",
      title: "Global Ready",
      description: "Built-in i18n support. Launch in multiple languages from day one.",
    },
  ],

  // Blog
  blog: {
    postsPerPage: 12,
    defaultAuthor: "Your Name",
    categories: ["Tutorials", "Guides", "Comparisons", "News"],
  },

  // Analytics (optional)
  analytics: {
    // Uncomment and add your IDs when ready
    // googleAnalyticsId: "G-XXXXXXXXXX",
    // plausibleDomain: "yourdomain.com",
    vercelAnalytics: true, // Enable Vercel Analytics
  },

  // Localization
  locales: [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    // Add more locales as needed
  ],
  defaultLocale: "en",
} as const;

export type SiteConfig = typeof siteConfig;
