import type { ComponentType, ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { TableOfContents } from '@/components/mdx/table-of-contents'
import { GoToTop } from '@/components/mdx/go-to-top'
import { source } from '@/lib/source'

export const runtime = 'edge'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.compressimage.dev'
const SUPPORTED_LOCALES = ['en', 'zh'] as const
const DEFAULT_OG_IMAGE = `${SITE_URL}/branding/og-default.png`

type TocNode = {
  depth: number
  title: string | { props?: { children?: ReactNode } }
  url: string
}

const localeToOg = (locale: string) => (locale === 'zh' ? 'zh_CN' : 'en_US')

const toRecord = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : undefined

const getDataRecord = (entry?: { data?: unknown } | null) => toRecord(entry?.data) ?? {}

const getString = (record: Record<string, unknown>, key: string) => {
  const value = record[key]
  return typeof value === 'string' ? value : undefined
}

const getBoolean = (record: Record<string, unknown>, key: string) => {
  const value = record[key]
  return typeof value === 'boolean' ? value : undefined
}

const getStringArray = (record: Record<string, unknown>, key: string) => {
  const value = record[key]
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

const getFaqEntries = (record: Record<string, unknown>) => {
  const value = record.faqs
  if (!Array.isArray(value)) return []
  return value.filter((faq): faq is { question: string; answer: string; href?: string } => {
    if (typeof faq !== 'object' || faq === null) return false
    const faqRecord = faq as Record<string, unknown>
    return typeof faqRecord.question === 'string' && typeof faqRecord.answer === 'string'
  })
}

const getTocEntries = (record: Record<string, unknown>): TocNode[] => {
  const value = record.toc
  return Array.isArray(value) ? (value as TocNode[]) : []
}

const getBodyComponent = (record: Record<string, unknown>) => {
  const body = record.body
  if (typeof body === 'function') {
    return body as ComponentType<Record<string, unknown>>
  }
  return (() => null) as ComponentType<Record<string, unknown>>
}

const isDraftEntry = (entry?: { data?: unknown } | null) => {
  const draft = getBoolean(getDataRecord(entry), 'draft')
  return draft === true
}

const getTranslationKey = (entry?: { data?: unknown } | null) =>
  getString(getDataRecord(entry), 'translationKey')

const buildAlternateLanguages = (slug: string, translationKey?: string) => {
  const entries = SUPPORTED_LOCALES.map((locale) => {
    let localizedPage = source.getPage([slug], locale)

    if (translationKey) {
      localizedPage =
        source
          .getPages(locale)
          .find((entry) => getTranslationKey(entry) === translationKey && !isDraftEntry(entry)) ??
        localizedPage
    }

    if (!localizedPage || isDraftEntry(localizedPage)) return null

    const href = localizedPage.url.startsWith('http')
      ? localizedPage.url
      : `${SITE_URL}${localizedPage.url.startsWith('/') ? '' : '/'}${localizedPage.url}`

    return [locale, href] as const
  }).filter(Boolean) as Array<readonly [string, string]>

  return Object.fromEntries(entries)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const page = source.getPage([slug], locale)

  if (!page) {
    return {
      title: 'CompressImage Blog',
      description: 'Guides and tutorials for optimizing images with CompressImage.',
    }
  }

  const dataRecord = getDataRecord(page)
  const title = getString(dataRecord, 'title') ?? slug
  const description =
    getString(dataRecord, 'description') ?? 'Tips, guides, and insights about image compression.'
  const rawImage = getString(dataRecord, 'image')
  const ogImage = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `${SITE_URL}${rawImage}`
    : DEFAULT_OG_IMAGE
  const dateValue = getString(dataRecord, 'date')
  const author = getString(dataRecord, 'author')
  const category = getString(dataRecord, 'category')
  const tags = getStringArray(dataRecord, 'tags')
  const translationKey = getString(dataRecord, 'translationKey')
  const isDraft = isDraftEntry(page)

  const canonicalUrl = page.url.startsWith('http')
    ? page.url
    : `${SITE_URL}${page.url.startsWith('/') ? '' : '/'}${page.url}`

  const languageAlternates = buildAlternateLanguages(slug, translationKey)
  const alternateLocales = SUPPORTED_LOCALES.filter((code) => code !== locale)

  return {
    metadataBase: new URL(SITE_URL),
    title: `${title} | CompressImage Blog`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description,
      siteName: 'CompressImage',
      locale: localeToOg(locale),
      alternateLocale: alternateLocales.map(localeToOg),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: dateValue,
      modifiedTime: dateValue,
      authors: author ? [author] : undefined,
      section: category,
      tags: tags.length > 0 ? tags : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !isDraft,
      follow: true,
    },
  }
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const t = await getTranslations('blog')
  const page = source.getPage([slug], locale)

  if (!page) {
    notFound()
  }

  const dataRecord = getDataRecord(page)
  const title = getString(dataRecord, 'title') ?? slug
  const description = getString(dataRecord, 'description')
  const dateValue = getString(dataRecord, 'date')
  const readTime = getString(dataRecord, 'readTime')
  const author = getString(dataRecord, 'author')
  const category = getString(dataRecord, 'category')
  const tags = getStringArray(dataRecord, 'tags')
  const tldr = getString(dataRecord, 'tldr')
  const translationKey = getString(dataRecord, 'translationKey')
  const rawImage = getString(dataRecord, 'image')
  const ogImage = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `${SITE_URL}${rawImage}`
    : DEFAULT_OG_IMAGE

  const bodyComponent = getBodyComponent(dataRecord)
  const MDX = bodyComponent
  const faqEntries = getFaqEntries(dataRecord)

  const alternatePage = translationKey
    ? SUPPORTED_LOCALES
        .filter((code) => code !== locale)
        .map((localeCode) =>
          source
            .getPages(localeCode)
            .find((entry) => getTranslationKey(entry) === translationKey && !isDraftEntry(entry))
        )
        .find((entry) => Boolean(entry))
    : undefined

  const fumadocsToc = getTocEntries(dataRecord)

  const extractTitle = (titleNode: TocNode['title']): string => {
    if (typeof titleNode === 'string') {
      return titleNode
    }
    if (titleNode && typeof titleNode === 'object') {
      const children = titleNode.props?.children
      if (typeof children === 'string') {
        return children
      }
      if (Array.isArray(children)) {
        return children.map((child) => (typeof child === 'string' ? child : '')).join('')
      }
    }
    return ''
  }

  const toc = {
    items: fumadocsToc
      .filter(item => item.depth === 2)
      .map((item) => {
        const nextH2Index = fumadocsToc.findIndex((h, i) =>
          i > fumadocsToc.indexOf(item) && h.depth === 2
        )

        const startIndex = fumadocsToc.indexOf(item)
        const endIndex = nextH2Index === -1 ? fumadocsToc.length : nextH2Index

        const h3Items = fumadocsToc
          .slice(startIndex + 1, endIndex)
          .filter(subItem => subItem.depth === 3)
          .map(subItem => ({
            title: extractTitle(subItem.title),
            url: subItem.url,
          }))

        return {
          title: extractTitle(item.title),
          url: item.url,
          items: h3Items
        }
      })
  }

  const pageUrl = page.url.startsWith('http') ? page.url : `${SITE_URL}${page.url}`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: author ? [{ '@type': 'Person', name: author }] : undefined,
    datePublished: dateValue,
    dateModified: dateValue,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    url: pageUrl,
    image: [ogImage],
    articleSection: category,
    keywords: tags.length > 0 ? tags.join(', ') : undefined,
    inLanguage: locale,
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'CompressImage',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/branding/logo-light.png`,
      },
    },
    sameAs: ['https://github.com/zenvel/compress-image-pro'],
  }

  const faqStructuredData = faqEntries.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqEntries.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
            url: faq.href
              ? (faq.href.startsWith('http')
                ? faq.href
                : `${SITE_URL}${faq.href.startsWith('/') ? '' : '/'}${faq.href}`)
              : undefined,
          },
        })),
      }
    : null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative py-6 max-w-full md:max-w-6xl mx-auto lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <article className="max-w-4xl mx-auto w-full px-6">
            <script
              type="application/ld+json"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            {faqStructuredData && (
              <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
              />
            )}
            <Link
              href={locale === 'en' ? '/blog' : `/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('backToBlog')}
            </Link>

            <header className="my-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time>
                    {dateValue
                      ? new Date(dateValue).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : '--'}
                  </time>
                </div>
                {readTime && (
                  <span>· {readTime}</span>
                )}
                {author && (
                  <span>· By {author}</span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                {category && (
                  <span className="font-semibold text-muted-foreground">
                    {t('categoryLabel', { category })}
                  </span>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-muted-foreground">
                      {t('tagsLabel')}
                    </span>
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="uppercase tracking-wide bg-accent/10 text-accent px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {alternatePage && alternatePage.url && (
                <div className="mt-4">
                  <Link
                    href={alternatePage.url}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                  >
                    {locale === 'en'
                      ? t('readInLanguage', { language: '中文' })
                      : t('readInLanguage', { language: 'English' })}
                  </Link>
                </div>
              )}
            </header>

            {tldr && (
              <div className="mb-10 rounded-xl border border-border bg-muted/30 p-6">
                <h2 className="text-lg font-semibold mb-3 text-foreground">
                  {t('tldrHeading')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {tldr}
                </p>
              </div>
            )}
            <div className="my-4">
              <MDX components={mdxComponents} />
            </div>
            {faqEntries.length > 0 && (
              <section className="mt-12 space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {t('faqHeading')}
                </h2>
                <div className="space-y-6">
                  {faqEntries.map((faq) => (
                    <div key={faq.question} className="rounded-lg border border-border p-5 bg-background/60">
                      {faq.href ? (
                        <Link href={faq.href} className="text-lg font-semibold text-accent hover:underline">
                          {faq.question}
                        </Link>
                      ) : (
                        <h3 className="text-lg font-semibold text-foreground">
                          {faq.question}
                        </h3>
                      )}
                      <p className="mt-2 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <footer className="mt-16 pt-8 border-t border-border">
              <Link
                href={locale === 'en' ? '/blog' : `/${locale}/blog`}
                className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToAllPosts')}
              </Link>
            </footer>
          </article>

          <div className="hidden text-sm xl:block">
            <div className="sticky top-16 -mt-6 h-[calc(100vh-3.5rem)]">
              <div className="h-full overflow-auto pb-10 flex flex-col justify-between mt-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <TableOfContents toc={toc} />
                <GoToTop />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
