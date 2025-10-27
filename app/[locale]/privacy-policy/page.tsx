"use client"
export const runtime = 'edge'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useTranslations } from 'next-intl'

export default function PrivacyPolicyPage() {
  const t = useTranslations('privacy')
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
            <p className="text-muted-foreground mb-12">{t('effectiveDate')}</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {t('intro')}
              </p>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t('images.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('images.paragraph1')}
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  {t('images.paragraph2')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t('collect.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('collect.intro')}
                </p>
                 <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                  <li>
                    <strong>{t('collect.analytics.title')}</strong>: {t('collect.analytics.description')}
                  </li>
                  <li>
                    <strong>{t('collect.contact.title')}</strong>: {t('collect.contact.description')}
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t('notCollect.title')}</h2>
                 <p className="text-muted-foreground leading-relaxed">
                  {t('notCollect.intro')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                  <li>{t('notCollect.item1')}</li>
                  <li>{t('notCollect.item2')}</li>
                  <li>{t('notCollect.item3')}</li>
                  <li>{t('notCollect.item4')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t('cookies.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('cookies.description')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t('changes.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('changes.description')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">{t('contactSection.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('contactSection.description')} <a href="mailto:privacy@compressimage.dev" className="text-primary hover:underline">privacy@compressimage.dev</a>.
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