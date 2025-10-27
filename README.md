# LaunchTool

> The fastest way to launch SEO-friendly tool websites

Launch your next web tool in **minutes, not months**. LaunchTool is a production-ready Next.js template that combines powerful tools with content marketing to drive organic growth.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

[Demo](https://demo.launchtool.dev) · [Documentation](./docs) · [Report Bug](https://github.com/zenvel/launchtool/issues)

---

## ✨ What is LaunchTool?

A Next.js template designed for indie makers who want to build **tool-first content sites** that rank on Google and attract users organically.

### Perfect for:
✅ Free online tools (converters, compressors, calculators)
✅ Lead generation tools for agencies
✅ SEO experiments and niche sites
✅ Side projects that need fast validation

### NOT designed for:
❌ Complex SaaS with user accounts
❌ Data-heavy applications requiring databases
❌ Enterprise software

💡 **Need auth & payments?** Check out the [SaaS migration guide](./docs/migration-to-saas.md) for integrating Clerk + Stripe when you're ready to monetize.

---

## 🎯 The "Tool + Content" Strategy

This template implements a proven growth framework used by successful tool websites:

```
1. 🔧 Tool provides immediate value
   ↓
2. 📝 Content ranks on Google
   ↓
3. 🌍 i18n multiplies traffic 2-5x
   ↓
4. 💰 Users convert naturally
```

### Real-world examples using this strategy:
- **TinyPNG** - Image compression tool → $500k/month
- **SmallPDF** - PDF tools → Acquired for $200M
- **RemoveBG** - Background removal → Multi-million dollar exit

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/zenvel/launchtool.git my-tool
cd my-tool

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) - your tool site is ready!

### Deploy to Vercel (free)

```bash
vercel --prod
```

**Your tool is live in 5 minutes.** 🎉

---

## 📦 What's Included

### Core Features
- ✅ **Next.js 15** with App Router & Edge Runtime
- ✅ **React 19** with Server Components
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS 4** with 56+ shadcn/ui components
- ✅ **Dark/Light theme** with next-themes

### Content & SEO
- ✅ **MDX blog system** powered by Fumadocs
- ✅ **i18n support** (English + Chinese, easily extensible)
- ✅ **SEO optimized** (meta tags, sitemap, structured data)
- ✅ **Blog templates** (tutorials, comparisons, guides)
- ✅ **Math equations** (KaTeX) & code highlighting

### Tool Features
- ✅ **Client-side processing** (privacy-first architecture)
- ✅ **File upload & drag-drop**
- ✅ **Before/after comparison slider**
- ✅ **Progress tracking**
- ✅ **Download functionality**

### Developer Experience
- ✅ **pnpm** for fast package management
- ✅ **ESLint** & **Prettier** configured
- ✅ **CLI scripts** for productivity
- ✅ **Hot reload** in development
- ✅ **One-click deploy** configs

---

## 📚 Documentation

- [Getting Started Guide](./TEMPLATE_GUIDE.md) - Detailed customization walkthrough
- [Project Structure](./docs/project-structure.md) - Understanding the codebase
- [Customization Guide](./docs/customization.md) - Branding, colors, and content
- [Deployment Guide](./docs/deployment.md) - Vercel, Cloudflare, and self-hosting
- [SEO Best Practices](./docs/seo-guide.md) - Rank your tool on Google
- [i18n Setup](./docs/i18n-guide.md) - Adding new languages
- [Migration to SaaS](./docs/migration-to-saas.md) - Adding auth & payments

---

## 🛠️ Built-in Examples

### 1. Image Compressor (included)
A fully functional image compression tool demonstrating:
- Client-side file processing
- Multiple format support (JPG, PNG, WebP, AVIF)
- Quality controls
- Real-time preview
- Batch processing

### 2. Coming Soon
We're adding more example tools:
- Text converters (Markdown ↔ HTML)
- Data formatters (JSON ↔ YAML)
- Code beautifiers
- File converters

---

## 🎨 Customization

### 1. Update site config

Edit [`config/site.config.ts`](./config/site.config.ts):

```typescript
export const siteConfig = {
  name: "YourTool",
  title: "YourTool - Do Something Amazing",
  description: "Your tool description",
  url: "https://yourdomain.com",
  // ... more settings
};
```

### 2. Customize branding

```bash
# Replace logo and favicon
cp your-logo.svg public/logo.svg
cp your-favicon.ico public/favicon.ico

# Update brand colors in tailwind.config.js
# Update OG images in public/og-image.png (1200x630px)
```

### 3. Create your first blog post

```bash
./scripts/new-post.sh "Your First Post Title" en
```

📖 **For detailed customization, see [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md)**

---

## 🌍 Internationalization (i18n)

LaunchTool includes built-in support for multiple languages:

- 🇺🇸 English (default)
- 🇨🇳 Chinese (Simplified)

**Adding a new language:**

1. Add locale in [`config/site.config.ts`](./config/site.config.ts)
2. Create `messages/{locale}.json`
3. Create `content/blog/{locale}/` directory

See [i18n Guide](./docs/i18n-guide.md) for details.

---

## 📊 SEO Strategy

LaunchTool implements SEO best practices out of the box:

### On-Page SEO
- ✅ Semantic HTML structure
- ✅ Optimized meta tags (title, description, OG, Twitter)
- ✅ Structured data (JSON-LD)
- ✅ Auto-generated sitemap
- ✅ Robots.txt configured

### Content SEO
- ✅ Blog system for long-tail keywords
- ✅ Internal linking structure
- ✅ Fast page loads (Edge Runtime)
- ✅ Mobile-responsive design

### Advanced SEO
- ✅ i18n for multiple markets
- ✅ Auto-generated Table of Contents
- ✅ Breadcrumb navigation
- ✅ Canonical URLs

📖 **Deep dive: [SEO Guide](./docs/seo-guide.md)**

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

### Cloudflare Pages

```bash
npm run build
npx wrangler pages publish out
```

### Self-Hosting

```bash
npm run build
npm run start
```

📖 **Full deployment guide: [docs/deployment.md](./docs/deployment.md)**

---

## 🗺️ Roadmap

- [x] Core template with tool + content system
- [x] i18n support (EN + ZH)
- [x] SEO optimization
- [x] Blog system with MDX
- [ ] More tool examples (text, data, code tools)
- [ ] Video tutorial series
- [ ] Community showcase
- [ ] Optional SaaS modules (@launchtool/auth, @launchtool/payments)
- [ ] CLI tool for scaffolding (`npx create-launchtool-app`)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

**TL;DR:** Build whatever you want, no attribution required. ✨

---

## 🙏 Credits

- Built with [Next.js](https://nextjs.org/) by Vercel
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Documentation powered by [Fumadocs](https://fumadocs.vercel.app/)
- Icons from [Lucide](https://lucide.dev/)

---

## 💬 Support

- 📖 [Documentation](./docs)
- 💬 [Discussions](https://github.com/zenvel/launchtool/discussions)
- 🐛 [Issue Tracker](https://github.com/zenvel/launchtool/issues)
- 📧 Email: hello@launchtool.dev

---

## 🌟 Showcase

Built something awesome with LaunchTool? [Add it to our showcase!](https://github.com/zenvel/launchtool/discussions/showcase)

---

**⭐ Star this repo if it helped you launch faster!**

Made with ❤️ by the LaunchTool community
