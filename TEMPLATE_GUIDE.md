# LaunchTool Template Guide

> Complete guide to customizing and launching your tool website

This guide walks you through every step of customizing LaunchTool for your specific use case. Follow along to transform this template into your production-ready tool website.

---

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Basic Configuration](#basic-configuration)
3. [Branding & Design](#branding--design)
4. [Creating Your Tool](#creating-your-tool)
5. [Content Strategy](#content-strategy)
6. [SEO Optimization](#seo-optimization)
7. [Deployment](#deployment)
8. [Advanced Features](#advanced-features)

---

## Initial Setup

### Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Basic knowledge of React and Next.js
- A code editor (VS Code recommended)

### Step 1: Clone and Install

```bash
# Clone the template
git clone https://github.com/zenvel/launchtool.git my-awesome-tool
cd my-awesome-tool

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Visit `http://localhost:3000` - you should see the default tool page.

---

## Basic Configuration

### Step 2: Update Site Config

Edit `config/site.config.ts` - this is your **single source of truth** for site-wide settings.

```typescript
export const siteConfig = {
  // 1. Basic Info
  name: "MyAwesomeTool",
  title: "MyAwesomeTool - Solve X Problem Instantly",
  description: "Convert, compress, or process your files in seconds. 100% free and privacy-first.",

  // 2. URL (update for production)
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://myawesometool.com",

  // 3. Author Info
  author: {
    name: "Your Name or Company",
    url: "https://yourwebsite.com",
    email: "hello@myawesometool.com",
  },

  // 4. Social Links (optional)
  social: {
    twitter: "https://twitter.com/myawesometool",
    github: "https://github.com/yourusername/myawesometool",
  },

  // 5. Navigation - customize your menu
  navigation: {
    main: [
      { name: "Features", href: "/features" },
      { name: "Blog", href: "/blog" },
      { name: "Pricing", href: "/pricing" }, // Remove if free forever
      { name: "About", href: "/about" },
    ],
    // ... footer links
  },

  // 6. Features (shown on homepage)
  features: [
    {
      icon: "ShieldCheck", // Lucide icon name
      title: "Privacy First",
      description: "All processing happens in your browser.",
    },
    // Add 2-3 more features
  ],
};
```

### Step 3: Update Environment Variables

Edit `.env.local`:

```bash
# Required: Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_SITE_URL=https://myawesometool.com  # Production

# Optional: Analytics
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Step 4: Update package.json

```json
{
  "name": "myawesometool",
  "version": "1.0.0",
  "description": "Your tool description",
  "author": "Your Name",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/myawesometool.git"
  }
}
```

---

## Branding & Design

### Step 5: Replace Branding Assets

#### 5.1 Favicon & App Icons

Replace these files in `public/`:

```
public/
├── favicon.ico           (32x32px)
├── favicon-16x16.png     (16x16px)
├── favicon-32x32.png     (32x32px)
├── apple-touch-icon.png  (180x180px)
├── android-chrome-192x192.png (192x192px)
└── android-chrome-512x512.png (512x512px)
```

**Quick generation:** Use [RealFaviconGenerator](https://realfavicongenerator.net/)

#### 5.2 Logo

Replace placeholder logo:

```bash
# SVG logo (recommended)
cp your-logo.svg public/logo.svg

# Or PNG (with transparent background)
cp your-logo.png public/logo.png
```

Update logo reference in `components/header.tsx`:

```tsx
<Image src="/logo.svg" alt="MyAwesomeTool" width={150} height={40} />
```

#### 5.3 OG Image (Social Sharing)

Create `public/og-image.png` (1200x630px) - this appears when sharing on social media.

**Template**: Include your logo + tagline + screenshot

Update in `app/[locale]/layout.tsx`:

```tsx
openGraph: {
  images: [{ url: '/og-image.png', width: 1200, height: 630 }],
},
```

### Step 6: Customize Colors & Theme

Edit `styles/globals.css` to match your brand:

```css
@layer base {
  :root {
    --primary: 262 83% 58%;      /* Your brand color */
    --primary-foreground: 0 0% 100%;

    /* Customize other colors */
    --accent: 262 83% 58%;
    --accent-foreground: 0 0% 100%;
  }
}
```

**Color tool:** Use [Tailwind Color Generator](https://uicolors.app/)

---

## Creating Your Tool

### Step 7: Understand the Example Tool

LaunchTool includes a complete **Image Compressor** example. Study these files:

```
app/[locale]/page.tsx              → Main tool page
components/image-processing-card.tsx → Tool logic & UI
lib/imageCompression.ts            → Processing logic
```

### Step 8: Adapt the Tool for Your Use Case

#### Option A: Modify Existing Tool

If your tool is similar (file processing, conversion, etc.):

1. **Update processing logic** in `lib/imageCompression.ts`
2. **Modify UI** in `components/image-processing-card.tsx`
3. **Update copy** in `messages/en.json` and `messages/zh.json`

#### Option B: Build From Scratch

Create a new tool component:

```bash
# Create new tool file
touch components/my-tool-card.tsx
```

```tsx
// components/my-tool-card.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function MyToolCard() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const handleProcess = () => {
    // Your tool logic here
    const result = processData(input)
    setOutput(result)
  }

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your input..."
      />
      <Button onClick={handleProcess}>Process</Button>
      {output && <div>Result: {output}</div>}
    </div>
  )
}
```

Update homepage (`app/[locale]/page.tsx`):

```tsx
import { MyToolCard } from "@/components/my-tool-card"

export default function Home() {
  return (
    <main>
      <h1>My Awesome Tool</h1>
      <MyToolCard />
    </main>
  )
}
```

### Step 9: Update Internationalization

Edit translation files for your tool:

**English** (`messages/en.json`):
```json
{
  "home": {
    "hero": {
      "title": "Process Your Files Instantly",
      "subtitle": "Fast, free, and privacy-first",
      "selectFiles": "Choose Files"
    },
    "tool": {
      "processing": "Processing...",
      "download": "Download Result"
    }
  }
}
```

**Chinese** (`messages/zh.json`):
```json
{
  "home": {
    "hero": {
      "title": "即时处理您的文件",
      "subtitle": "快速、免费、隐私优先",
      "selectFiles": "选择文件"
    }
  }
}
```

Use translations in components:

```tsx
import { useTranslations } from 'next-intl'

function Component() {
  const t = useTranslations('home.hero')
  return <h1>{t('title')}</h1>
}
```

---

## Content Strategy

### Step 10: Plan Your Content

The "Tool + Content" strategy requires blog posts that:

1. **Target keywords** users search for
2. **Link to your tool** naturally
3. **Provide value** beyond the tool

**Example for image compressor:**
- "How to Compress Images Without Losing Quality"
- "Best Image Formats for Web (2025 Guide)"
- "10 Free Image Compression Tools Compared"

### Step 11: Create Blog Posts

Use the built-in script:

```bash
./scripts/new-post.sh "How to Use My Tool Effectively" en
```

This creates `content/blog/en/how-to-use-my-tool-effectively.mdx`:

```mdx
---
title: "How to Use My Tool Effectively"
description: "Complete guide to getting the most out of MyAwesomeTool"
date: "2025-01-15"
author: "Your Name"
readTime: "5 min read"
category: Guides
tags:
  - tutorial
  - guide
---

## Introduction

Start with a hook that includes your target keyword...

## Step 1: Upload Your File

Use MyAwesomeTool to [process your files](/). Here's how...

## Conclusion

[Try it now](/) - it's completely free!
```

**SEO Tips:**
- Include target keyword in title, H1, and first paragraph
- Add internal links to your tool page
- Use images with alt text
- Aim for 1000-2000 words for in-depth guides

### Step 12: Translate Content

Create Chinese version:

```bash
./scripts/new-post.sh "如何有效使用我的工具" zh
```

Or use AI to translate:
- ChatGPT prompt: "Translate this blog post to Chinese, maintaining SEO keywords and natural tone"
- DeepL for better accuracy

---

## SEO Optimization

### Step 13: Optimize Meta Tags

Each page should have unique meta tags. Example for homepage (`app/[locale]/page.tsx`):

```tsx
export const metadata: Metadata = {
  title: "MyAwesomeTool - Process Files Instantly",
  description: "Fast, free tool to convert and process your files. No upload required, 100% privacy-first.",
  keywords: ["file converter", "online tool", "free converter"],
  openGraph: {
    title: "MyAwesomeTool - Process Files Instantly",
    description: "Fast, free tool to convert and process your files.",
    images: ["/og-image.png"],
  },
}
```

### Step 14: Add Structured Data

LaunchTool includes structured data examples. Customize for your tool in `app/[locale]/page.tsx`:

```tsx
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MyAwesomeTool',
  description: 'Your tool description',
  applicationCategory: 'Utility',
  offers: {
    '@type': 'Offer',
    price: 0,
    priceCurrency: 'USD',
  },
}
```

### Step 15: Submit Sitemap

After deployment, submit your sitemap to search engines:

- **Google Search Console**: `https://search.google.com/search-console`
- **Bing Webmaster**: `https://www.bing.com/webmasters`

Your sitemap is auto-generated at: `https://yourdomain.com/sitemap.xml`

---

## Deployment

### Step 16: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Configure custom domain:**
1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your domain (e.g., `myawesometool.com`)
3. Update DNS records as instructed
4. Update `.env.local` with production URL

### Step 17: Deploy to Cloudflare Pages

```bash
# Build for static export
pnpm build

# Deploy
npx wrangler pages publish out
```

### Step 18: Setup Analytics

#### Vercel Analytics (Built-in)
Already enabled in `app/[locale]/layout.tsx`:

```tsx
import { Analytics } from "@vercel/analytics/next"

<Analytics />
```

#### Google Analytics (Optional)

1. Get your GA4 tracking ID
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
3. Add to `app/[locale]/layout.tsx`:
   ```tsx
   <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
   ```

---

## Advanced Features

### Adding More Languages

1. Add locale to `config/site.config.ts`:
   ```tsx
   locales: [
     { code: "en", name: "English", flag: "🇺🇸" },
     { code: "zh", name: "中文", flag: "🇨🇳" },
     { code: "es", name: "Español", flag: "🇪🇸" }, // New
   ],
   ```

2. Create `messages/es.json`
3. Create `content/blog/es/` directory
4. Update `routing.ts`:
   ```tsx
   locales: ['en', 'zh', 'es']
   ```

### Adding Authentication (Optional)

See [Migration to SaaS Guide](./docs/migration-to-saas.md) for:
- Integrating Clerk or Supabase Auth
- Adding user dashboards
- Implementing API rate limiting

### Custom Domain Setup

1. **Purchase domain** (Namecheap, Google Domains, etc.)
2. **Add to Vercel/Cloudflare**
3. **Update DNS records**:
   ```
   Type    Name    Value
   A       @       76.76.21.21
   CNAME   www     cname.vercel-dns.com
   ```
4. **Wait for DNS propagation** (1-48 hours)
5. **Update .env.local**:
   ```
   NEXT_PUBLIC_SITE_URL=https://myawesometool.com
   ```

---

## Next Steps

✅ **Launch Checklist:**
- [ ] Site config updated
- [ ] Branding assets replaced
- [ ] Tool functionality working
- [ ] At least 5 blog posts published
- [ ] Meta tags optimized
- [ ] Sitemap submitted to Google
- [ ] Analytics configured
- [ ] Custom domain connected
- [ ] SSL certificate active

🚀 **Post-Launch:**
- [ ] Share on social media
- [ ] Submit to Product Hunt / Hacker News
- [ ] Build backlinks (guest posts, directories)
- [ ] Monitor Google Search Console
- [ ] Publish new content weekly
- [ ] Engage with users (add feedback form)

---

## Getting Help

- 📖 [Documentation](./docs)
- 💬 [Community Discussions](https://github.com/yourusername/launchtool/discussions)
- 🐛 [Report Issues](https://github.com/yourusername/launchtool/issues)

---

**Congratulations! You're ready to launch your tool website.** 🎉

Remember: Launch quickly, gather feedback, iterate based on real user data. Don't spend months perfecting - ship and improve!
