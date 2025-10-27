"use client"
export const runtime = 'edge'

import { useState, useRef, useEffect } from "react"
import { CloudUpload, ShieldCheck, Zap, Sparkles, Shield } from "lucide-react"
import { useLocale, useTranslations } from 'next-intl'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ImageProcessingCard } from "@/components/image-processing-card"
import { Button } from "@/components/ui/button"
import { preloadImageCompression } from "@/lib/imageCompression"

export interface UploadedImage {
  id: string
  file: File
  filename: string
  originalSize: number
  thumbnailUrl: string
}

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('home')
  const locale = useLocale()

  useEffect(() => {
    preloadImageCompression().catch((err) => {
      console.error('Failed to preload compression library on home mount:', err)
    })
  }, [])

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.compressimage.dev').replace(/\/$/, '')
  const quickAnswerSteps = ['upload', 'adjust', 'download'] as const
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CompressImage',
    description: 'Compress JPG, PNG, WebP, and AVIF images privately and efficiently. 100% client-side processing.',
    applicationCategory: 'MultimediaApplication',
    inLanguage: locale,
    operatingSystem: 'Web Browser',
    url: `${siteUrl}${locale === 'en' ? '' : `/${locale}`}`,
    image: `${siteUrl}/branding/og-default.png`,
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}${locale === 'en' ? '' : `/${locale}`}`,
    },
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}${locale === 'en' ? '' : `/${locale}`}`,
      },
    },
    creator: {
      '@type': 'Organization',
      name: 'CompressImage',
      url: siteUrl,
    },
    sameAs: ['https://github.com/zenvel/compress-image-pro'],
    features: [
      'Client-side compression with privacy-first architecture',
      'Supports JPG, PNG, WebP, and AVIF formats',
      'Quality controls, before/after preview, and instant downloads',
    ],
  }

  const handleSelectImages = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: UploadedImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Only accept image files
      if (!file.type.startsWith('image/')) {
        console.warn(`Skipping non-image file: ${file.name}`)
        continue
      }

      // Create thumbnail URL
      const thumbnailUrl = URL.createObjectURL(file)

      const uploadedImage: UploadedImage = {
        id: `${Date.now()}-${i}`,
        file,
        filename: file.name,
        originalSize: file.size,
        thumbnailUrl,
      }

      newImages.push(uploadedImage)
    }

    setUploadedImages((prev) => [...prev, ...newImages])

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (id: string) => {
    setUploadedImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image) {
        // Revoke object URL to free memory
        URL.revokeObjectURL(image.thumbnailUrl)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Hero & Tool Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {uploadedImages.length === 0 ? (
            // Initial State - Dropzone
            <div className="max-w-4xl mx-auto">
              <div className="border-2 border-dashed border-border rounded-lg p-12 md:p-20 text-center hover:border-accent/50 transition-colors">
                <CloudUpload className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 text-muted-foreground" />
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
                  {t('hero.title')}
                </h1>
                <h2 className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
                  {t('hero.subtitle')}
                </h2>
                <Button size="lg" className="mb-6" onClick={handleSelectImages}>
                  {t('hero.selectImages')}
                </Button>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>{t('hero.privacyNote')}</span>
                </div>
              </div>
            </div>
          ) : (
            // Active State - Image Processing Grid
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('processing.title')}</h1>
                <p className="text-muted-foreground">{t('processing.subtitle')}</p>
              </div>
              <div className="grid gap-6">
                {uploadedImages.map((image) => (
                  <ImageProcessingCard
                    key={image.id}
                    image={image}
                    onRemove={() => handleRemoveImage(image.id)}
                  />
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={handleSelectImages}>
                  {t('processing.addMore')}
                </Button>
              </div>
            </div>
          )}

          <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
              {t('quickAnswer.title')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('quickAnswer.summary')}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {quickAnswerSteps.map((stepKey, index) => (
                <div
                  key={stepKey}
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/80 p-4 sm:flex-col sm:items-start sm:gap-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-base font-semibold text-accent">
                    {index + 1}
                  </span>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">
                      {t(`quickAnswer.steps.${stepKey}.title`)}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`quickAnswer.steps.${stepKey}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="bg-card border-y border-border py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {/* Feature 1 */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10 text-accent mb-2">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{t('features.privacy.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.privacy.description')}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10 text-accent mb-2">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{t('features.fast.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.fast.description')}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10 text-accent mb-2">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{t('features.futureReady.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.futureReady.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <article className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
              {t('seo.title')}
            </h2>

            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">{t('seo.whyMatters.title')}</h3>
                <p>
                  {t('seo.whyMatters.content')}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">{t('seo.formats.title')}</h3>
                <p>
                  {t('seo.formats.content')}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">{t('seo.processing.title')}</h3>
                <p>
                  {t('seo.processing.content')}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">{t('seo.bestPractices.title')}</h3>
                <p>
                  {t('seo.bestPractices.content')}
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  )
}
