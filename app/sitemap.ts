import type { MetadataRoute } from 'next'

import { source } from '@/lib/source'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.compressimage.dev'
const SUPPORTED_LOCALES = ['en', 'zh'] as const
const DEFAULT_LOCALE = 'en'

const STATIC_ROUTES: Array<{
  path: string
  changeFrequency: Exclude<MetadataRoute.Sitemap[number]['changeFrequency'], undefined>
  priority: number
}> = [
  { path: '', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/features', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/help-center', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/terms-of-service', changeFrequency: 'yearly', priority: 0.4 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of SUPPORTED_LOCALES) {
    const isDefaultLocale = locale === DEFAULT_LOCALE
    const prefix = isDefaultLocale ? '' : `/${locale}`

    for (const route of STATIC_ROUTES) {
      const path = route.path === '' ? (isDefaultLocale ? '/' : prefix) : `${prefix}${route.path}`

      entries.push({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      })
    }

    entries.push({
      url: `${SITE_URL}${prefix}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    })

    const allPosts = source
      .getPages(locale)
      .filter((page) => !isDraft(page))
      .sort((a, b) => {
        const dateA = getPageDate(a)?.getTime() ?? 0
        const dateB = getPageDate(b)?.getTime() ?? 0
        return dateB - dateA
      })

    for (const page of allPosts) {
      const lastModified = getPageDate(page) ?? now
      const pagePath = page.url.startsWith('http')
        ? page.url
        : `${SITE_URL}${page.url.startsWith('/') ? '' : '/'}${page.url}`

      entries.push({
        url: pagePath,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    }
  }

  return entries
}
type PageEntry = ReturnType<typeof source.getPages>[number]

const isDraft = (entry: PageEntry) => {
  const draftValue = (entry.data as Record<string, unknown> | undefined)?.draft
  return typeof draftValue === 'boolean' ? draftValue : false
}

const getPageDate = (entry: PageEntry) => {
  const dateValue = (entry.data as Record<string, unknown> | undefined)?.date
  return typeof dateValue === 'string' ? new Date(dateValue) : undefined
}
