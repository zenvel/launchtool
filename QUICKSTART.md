# LaunchTool Quick Start

> Get your tool website running in 5 minutes

---

## 🚀 Fast Track

```bash
# 1. Clone the template
git clone https://github.com/zenvel/launchtool.git my-awesome-tool
cd my-awesome-tool

# 2. Run setup script
./scripts/setup.sh
```

The setup script will:
- ✅ Install dependencies with pnpm
- ✅ Create `.env.local` from template
- ✅ Prompt for basic configuration
- ✅ Start development server (optional)

**That's it!** Your tool site is running at `http://localhost:3000`

---

## ⚡ Manual Setup (if setup script doesn't work)

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development
pnpm dev
```

---

## 🎨 Next Steps (5 minutes each)

### 1. Update Site Config (config/site.config.ts)

```typescript
export const siteConfig = {
  name: "MyAwesomeTool",  // ← Change this
  title: "MyAwesomeTool - Solve X Problem Instantly",  // ← And this
  description: "Your tool description",  // ← And this
  url: "https://myawesometool.com",  // ← Production URL
  // ... rest stays the same for now
}
```

### 2. Replace Branding (public/)

```bash
# Replace these files with your own:
public/favicon.ico
public/logo.svg or logo.png
public/og-image.png  # (1200x630px for social sharing)
```

### 3. Update Homepage Content (app/[locale]/page.tsx)

The default homepage includes an image compressor example. You can:
- **Option A**: Modify the existing tool for your use case
- **Option B**: Replace it entirely with your tool

### 4. Create Your First Blog Post

```bash
./scripts/new-post.sh "How to Use MyAwesomeTool" en
```

Edit the created file in `content/blog/en/how-to-use-myawesometool.mdx`

---

## 📦 What You Get Out of the Box

✅ **Working tool example** - Image compressor (modify or replace)
✅ **SEO-optimized blog** - MDX with Fumadocs
✅ **Internationalization** - English + Chinese (add more easily)
✅ **56+ UI components** - shadcn/ui ready to use
✅ **Dark/Light theme** - Automatically switches
✅ **Static pages** - About, Features, Pricing, Help Center, etc.
✅ **Edge Runtime** - Fast global performance
✅ **One-click deploy** - Vercel, Cloudflare, or self-host

---

## 🚢 Deploy to Production

### Vercel (Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Cloudflare Pages

```bash
# Build
pnpm build

# Deploy
npx wrangler pages publish out
```

📖 **Full deployment guide**: [docs/guides/deployment.md](./docs/guides/deployment.md)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project overview and features |
| [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) | **Complete customization walkthrough** ⭐ |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |
| [docs/guides/deployment.md](./docs/guides/deployment.md) | Deployment to Vercel, Cloudflare, etc. |

---

## 🎯 Common Tasks

### Add a new language

1. Edit `config/site.config.ts`:
   ```ts
   locales: [
     { code: "en", name: "English", flag: "🇺🇸" },
     { code: "zh", name: "中文", flag: "🇨🇳" },
     { code: "es", name: "Español", flag: "🇪🇸" },  // New
   ]
   ```

2. Create `messages/es.json` (copy from `en.json`)
3. Create `content/blog/es/` directory
4. Update `routing.ts` to include `'es'`

### Customize colors

Edit `styles/globals.css`:

```css
:root {
  --primary: 262 83% 58%;  /* Your brand color */
}
```

Use [uicolors.app](https://uicolors.app/) to generate color scales.

### Remove unnecessary pages

Don't need pricing? Delete:
- `app/[locale]/pricing/page.tsx`
- Remove from navigation in `config/site.config.ts`

---

## 🛠️ Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Run production build locally
pnpm lint         # Run ESLint

./scripts/new-post.sh "Title" en    # Create blog post
./scripts/setup.sh                  # Re-run setup
```

---

## ❓ Troubleshooting

### "pnpm: command not found"
```bash
npm install -g pnpm
```

### Build errors
```bash
# Clean install
rm -rf node_modules .next
pnpm install
pnpm build
```

### Port 3000 already in use
```bash
# Use different port
pnpm dev -- -p 3001
```

---

## 💬 Get Help

- 📖 [Full Documentation](./TEMPLATE_GUIDE.md)
- 💬 [GitHub Discussions](https://github.com/yourusername/launchtool/discussions)
- 🐛 [Report Issues](https://github.com/yourusername/launchtool/issues)

---

## ✅ Launch Checklist

Before going live:

- [ ] Site config updated
- [ ] Branding replaced (favicon, logo, OG image)
- [ ] At least 3-5 blog posts written
- [ ] All pages reviewed
- [ ] Tool tested thoroughly
- [ ] Meta tags optimized
- [ ] Production URL set in `.env.local`
- [ ] Deployed to hosting
- [ ] Custom domain connected
- [ ] Sitemap submitted to Google

---

**Ready to build something awesome!** 🎉

If you get stuck, check [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) for detailed instructions.
