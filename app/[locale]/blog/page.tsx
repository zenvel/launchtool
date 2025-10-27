import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTranslations } from 'next-intl/server'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { source } from '@/lib/source'

export const runtime = 'edge'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.compressimage.dev').replace(/\/$/, '')
const POSTS_PER_PAGE = 10
const SUPPORTED_LOCALES = ['en', 'zh'] as const
const DEFAULT_LOCALE = 'en'

const localeToOg = (locale: string) => (locale === 'zh' ? 'zh_CN' : 'en_US')

const getBlogPath = (locale: string, page: number) => {
  const basePath = locale === DEFAULT_LOCALE ? '/blog' : `/${locale}/blog`
  return page > 1 ? `${basePath}?page=${page}` : basePath
}

const sortPosts = (locale: string) =>
  source
    .getPages(locale)
    .filter((page) => page.data.draft !== true)
    .sort((a, b) => {
      const dateA = new Date(a.data.date || 0).getTime()
      const dateB = new Date(b.data.date || 0).getTime()
      return dateB - dateA
    })
  
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { page: pageQuery } = await searchParams
  const t = await getTranslations({ locale, namespace: 'blog' })

  const allPosts = sortPosts(locale)
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE))
  const parsedPage = Number.parseInt(pageQuery ?? '1', 10)
  const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? Math.min(parsedPage, totalPages) : 1

  const canonicalPath = getBlogPath(locale, currentPage)
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  const languageAlternates = Object.fromEntries(
    SUPPORTED_LOCALES.map((supportedLocale) => {
      const localizedPosts = sortPosts(supportedLocale)
      const localizedTotalPages = Math.max(1, Math.ceil(localizedPosts.length / POSTS_PER_PAGE))
      const safePage = Math.min(currentPage, localizedTotalPages)
      const href = `${SITE_URL}${getBlogPath(supportedLocale, safePage)}`
      return [supportedLocale, href]
    })
  )

  const pageTitle =
    currentPage > 1
      ? `${t('title')} – ${t('pagination.page', {
        current: currentPage,
        total: totalPages,
      })}`
      : `${t('title')} | CompressImage`

  const description = t('subtitle')

  return {
    metadataBase: new URL(SITE_URL),
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: pageTitle,
      description,
      siteName: 'CompressImage',
      locale: localeToOg(locale),
      alternateLocale: SUPPORTED_LOCALES.filter((code) => code !== locale).map(localeToOg),
      images: [
        {
          url: `${SITE_URL}/branding/og-default.png`,
          width: 1200,
          height: 630,
          alt: 'CompressImage blog hero image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [`${SITE_URL}/branding/og-default.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function BlogPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale } = await params
  const { page: pageQuery } = await searchParams
  const t = await getTranslations('blog')

  const currentPage = Number.parseInt(pageQuery ?? '1', 10)
  if (!Number.isInteger(currentPage) || currentPage <= 0) {
    notFound()
  }

  const allPosts = sortPosts(locale)

  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE))

  if (allPosts.length === 0 && currentPage > 1) {
    notFound()
  }

  if (allPosts.length > 0 && currentPage > totalPages) {
    notFound()
  }

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">{t('title')}</h1>
            <p className="text-xl text-muted-foreground text-balance">
              {t('subtitle')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-12">
            {paginatedPosts.length === 0 ? (
              <p className="text-muted-foreground">{t('noPosts')}</p>
            ) : (
              paginatedPosts.map((post) => (
                <article key={post.url} className="border-b border-border pb-12 last:border-0">
                  <time className="text-sm text-muted-foreground">
                    {new Date(post.data.date || '').toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <h2 className="text-3xl font-bold mt-2 mb-4">
                    <Link href={post.url} className="hover:text-muted-foreground transition-colors">
                      {post.data.title}
                    </Link>
                  </h2>
                  {post.data.category && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('categoryLabel', { category: post.data.category })}
                    </p>
                  )}
                  {Array.isArray(post.data.tags) && post.data.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                        {t('tagsLabel')}
                      </span>
                      {post.data.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs uppercase tracking-wide bg-accent/10 text-accent px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-muted-foreground leading-relaxed mb-4">{post.data.description}</p>
                  <Link href={post.url} className="text-sm font-semibold hover:underline">
                    {t('readMore')} →
                  </Link>
                </article>
              ))
            )}
          </div>

          {paginatedPosts.length > 0 && totalPages > 1 && (
            <div className="max-w-3xl mx-auto mt-16 flex flex-col items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {t('pagination.page', { current: currentPage, total: totalPages })}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/${locale === 'en' ? '' : `${locale}/`}blog?page=${currentPage - 1}`}
                    className="px-3 py-1 border border-border rounded-md text-sm hover:bg-accent/10 transition-colors"
                  >
                    {t('pagination.previous')}
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={`/${locale === 'en' ? '' : `${locale}/`}blog?page=${pageNumber}`}
                    className={`px-3 py-1 border border-border rounded-md text-sm transition-colors ${
                      pageNumber === currentPage ? 'bg-foreground text-background border-foreground' : 'hover:bg-accent/10'
                    }`}
                  >
                    {pageNumber}
                  </Link>
                ))}
                {currentPage < totalPages && (
                  <Link
                    href={`/${locale === 'en' ? '' : `${locale}/`}blog?page=${currentPage + 1}`}
                    className="px-3 py-1 border border-border rounded-md text-sm hover:bg-accent/10 transition-colors"
                  >
                    {t('pagination.next')}
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
