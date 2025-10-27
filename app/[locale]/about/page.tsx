"use client"
export const runtime = 'edge'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Link } from "@/routing"
import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-balance">{t('title')}</h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {t('intro')}
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-4">{t('mission.title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('mission.content')}
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-4">{t('whyUs.title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('whyUs.content')}
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-4">{t('technology.title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('technology.content')}
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-4">{t('contact.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.rich('contact.content', {
                  contactLink: (chunks) => (
                    <Link href="/contact" className="text-primary hover:underline">
                      {chunks}
                    </Link>
                  )
                })}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
