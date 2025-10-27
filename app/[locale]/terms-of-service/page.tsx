"use client"
export const runtime = 'edge'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useTranslations } from 'next-intl'

export default function TermsOfServicePage() {
  const t = useTranslations('terms')
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
            <p className="text-muted-foreground mb-12">{t('effectiveDate')}</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">{t('useOfService.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('useOfService.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t('userResponsibilities.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('userResponsibilities.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t('disclaimer.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimer.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t('limitation.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('limitation.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t('changes.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('changes.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t('law.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('law.content')}
                </p>
              </section>

               <section>
                <h2 className="text-2xl font-bold mb-4">{t('contactSection.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('contactSection.content')}{" "}
                  <a href="mailto:contact@compressimage.dev" className="text-primary hover:underline">
                    contact@compressimage.dev
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}