import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { locales } from '@/i18n/request'
import "../globals.css"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.compressimage.dev'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CompressImage - The Ultimate Image Optimizer",
  description: "Compress JPG, PNG, WebP, and AVIF images privately and efficiently. 100% client-side processing.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon.ico' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: "CompressImage - The Ultimate Image Optimizer",
    description: "Compress JPG, PNG, WebP, and AVIF images privately and efficiently. 100% client-side processing.",
    images: [
      {
        url: `${SITE_URL}/branding/og-default.png`,
        width: 1200,
        height: 630,
        alt: "CompressImage social preview",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "CompressImage - The Ultimate Image Optimizer",
    description: "Compress JPG, PNG, WebP, and AVIF images privately and efficiently. 100% client-side processing.",
    images: [`${SITE_URL}/branding/og-default.png`],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  // Await params as required by Next.js 15
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  const isSupportedLocale = locales.some((supportedLocale) => supportedLocale === locale);
  if (!isSupportedLocale) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const isChineseLocale = locale === 'zh'

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        {isChineseLocale && (
          <>
            <link
              rel="preconnect"
              href="https://cdn.jsdelivr.net"
              crossOrigin=""
            />
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.1.0/style.css"
            />
          </>
        )}
      </head>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
        style={isChineseLocale ? { fontFamily: '"LXGW WenKai Lite", "Segoe UI", system-ui, sans-serif' } : undefined}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <NextIntlClientProvider messages={messages}>
            {children}
            <Analytics />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
