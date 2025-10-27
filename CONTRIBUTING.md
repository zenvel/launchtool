# Contributing to LaunchTool

First off, thank you for considering contributing to LaunchTool! It's people like you that make LaunchTool such a great template for the community.

## 🎯 Ways to Contribute

- 🐛 **Report bugs** - Found a bug? [Open an issue](https://github.com/youruszenvelername/launchtool/issues/new)
- 💡 **Suggest features** - Have an idea? [Start a discussion](https://github.com/zenvel/launchtool/discussions/new)
- 📝 **Improve documentation** - Fix typos, clarify instructions, add examples
- 🔧 **Add tool examples** - Build new example tools (text tools, converters, etc.)
- 🌍 **Add translations** - Help translate the template to more languages
- 🎨 **Enhance UI/UX** - Improve components, accessibility, mobile experience
- 🚀 **Share your project** - Built something with LaunchTool? Show it off!

---

## 🚀 Quick Start for Contributors

### 1. Fork and Clone

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/zenvel/launchtool.git
cd launchtool

# Add upstream remote
git remote add upstream https://github.com/zenvel/launchtool.git
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/add-markdown-converter` - New features
- `fix/header-mobile-bug` - Bug fixes
- `docs/improve-readme` - Documentation
- `refactor/simplify-config` - Code refactoring

### 4. Make Changes

- Write clear, readable code
- Follow the existing code style
- Add comments for complex logic
- Test your changes locally

### 5. Test Your Changes

```bash
# Run development server
pnpm dev

# Run linter
pnpm lint

# Build to ensure no errors
pnpm build
```

### 6. Commit Your Changes

```bash
git add .
git commit -m "feat: add markdown to HTML converter"
```

**Commit message format:**
```
<type>: <short description>

[optional longer description]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Build process, dependencies, etc.

**Examples:**
```
feat: add text case converter tool
fix: resolve mobile menu not closing on route change
docs: improve deployment guide with Cloudflare Pages
refactor: simplify site config structure
```

### 7. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub with:
- **Clear title** describing what you changed
- **Description** explaining why and how
- **Screenshots** for UI changes
- **Testing instructions** so reviewers can verify

---

## 📋 Contribution Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new files
- **Naming**: Use `camelCase` for variables, `PascalCase` for components
- **Imports**: Group imports (React, Next.js, components, utils)
- **Components**: One component per file
- **Tailwind**: Use Tailwind classes, avoid inline styles

**Good example:**
```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { convertMarkdown } from "@/lib/markdown"

export function MarkdownConverter() {
  const [input, setInput] = useState("")

  return (
    <div className="space-y-4">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <Button onClick={() => convertMarkdown(input)}>Convert</Button>
    </div>
  )
}
```

### File Structure

```
launchtool/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components (don't modify directly)
│   └── *.tsx              # Custom components
├── lib/                    # Utilities and business logic
├── config/                 # Configuration files
├── messages/               # i18n translation files
├── content/                # Blog content (MDX)
├── public/                 # Static assets
├── docs/                   # Documentation
└── scripts/                # CLI helper scripts
```

### Adding New Tool Examples

When contributing a new tool example:

1. **Create tool logic** in `lib/tools/your-tool.ts`
2. **Create UI component** in `components/your-tool-card.tsx`
3. **Add translations** in `messages/en.json` and `messages/zh.json`
4. **Document usage** in a new `docs/examples/your-tool.md`
5. **Add to README** under "Built-in Examples"

**Example PR structure:**
```
feat: add JSON to YAML converter

- Adds bidirectional JSON ↔ YAML conversion
- Client-side processing with js-yaml library
- Syntax highlighting for both formats
- Error handling for invalid input
- Translations for EN and ZH
```

### Adding New Languages

1. **Add locale** to `config/site.config.ts`:
   ```ts
   locales: [
     // ...existing
     { code: "es", name: "Español", flag: "🇪🇸" }
   ]
   ```

2. **Create translation file** `messages/es.json` (copy from `en.json`)
3. **Translate all keys** - use native speakers if possible
4. **Update routing** in `routing.ts`
5. **Test thoroughly** - check all pages render correctly

### Documentation

- **Be clear and concise** - readers are busy
- **Use examples** - show, don't just tell
- **Add screenshots** - especially for UI changes
- **Keep updated** - if you change code, update docs

### Testing

While we don't have automated tests yet, **manual testing is required**:

- ✅ Test on desktop (Chrome, Firefox, Safari)
- ✅ Test on mobile (iOS, Android)
- ✅ Test dark/light themes
- ✅ Test both EN and ZH locales
- ✅ Test with real files/data
- ✅ Check console for errors

---

## 🐛 Reporting Bugs

**Before reporting:**
1. Check existing [issues](https://github.com/zenvel/launchtool/issues)
2. Try the latest version
3. Reproduce in a clean environment

**When reporting, include:**
- **Description** - What happened vs. what should happen
- **Steps to reproduce** - Exact steps to trigger the bug
- **Environment** - OS, browser, Node version
- **Screenshots** - If applicable
- **Console logs** - Any error messages

**Use the bug report template:**
```markdown
## Bug Description
Clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Screenshots
If applicable, add screenshots.

## Environment
- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120]
- Node: [e.g., 20.10.0]
```

---

## 💡 Requesting Features

Feature requests are welcome! Please:

1. **Check discussions** first - might already be planned
2. **Explain the use case** - why is this needed?
3. **Describe the solution** - how should it work?
4. **Consider alternatives** - any other approaches?

**Start a discussion** before writing code for major features.

---

## 📦 Pull Request Process

1. **Update documentation** if needed
2. **Add yourself** to contributors (if first PR)
3. **Ensure CI passes** (once we add it)
4. **Request review** from maintainers
5. **Address feedback** promptly

### PR Review Checklist

Reviewers will check:
- ✅ Code follows style guidelines
- ✅ Changes are well-tested
- ✅ Documentation is updated
- ✅ Commit messages are clear
- ✅ No breaking changes (or clearly documented)

### Merge Criteria

- At least one approving review
- All discussions resolved
- CI passes (linting, build)
- Documentation updated

---

## 🌟 Recognition

Contributors will be:
- Listed in [README.md](./README.md) contributors section
- Mentioned in release notes
- Given credit in commit history

**First-time contributors** especially welcome! Don't hesitate to ask questions.

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Examples of good behavior:**
- Being respectful and inclusive
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Examples of unacceptable behavior:**
- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information

### Enforcement

Violations may result in temporary or permanent ban from the project.

Report issues to: [conduct@launchtool.dev](mailto:conduct@launchtool.dev)

---

## 💬 Questions?

- 💬 [Start a discussion](https://github.com/zenvel/launchtool/discussions)
- 📧 Email: [hello@launchtool.dev](mailto:hello@launchtool.dev)
- 🐦 Twitter: [@launchtool](https://twitter.com/launchtool)

---

**Thank you for making LaunchTool better!** 🎉

Every contribution, no matter how small, is valued and appreciated.
