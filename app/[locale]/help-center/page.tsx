"use client"
export const runtime = 'edge'

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Book, MessageCircle, Mail } from "lucide-react";
import { Link } from "@/routing";
import { useTranslations } from 'next-intl';

export default function HelpCenterPage() {
  const t = useTranslations('helpCenter');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">{t('title')}</h1>
            <p className="text-xl text-muted-foreground text-balance">
              {t('subtitle')}
            </p>
          </div>

          {/* --- Optimized Support Options --- */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <Link href="/blog" className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                <Book className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{t('support.documentation.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('support.documentation.description')}</p>
            </Link>
            <Link href="/contact?intent=feedback" className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{t('support.feedback.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('support.feedback.description')}</p>
            </Link>
            <Link href="/contact?intent=support" className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{t('support.email.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('support.email.description')}</p>
            </Link>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">{t('faqTitle')}</h2>
            <div className="space-y-6">
              <div className="border-b border-border pb-6">
                <h3 className="text-xl font-semibold mb-3">{t('faqs.compression.question')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('faqs.compression.answer')}</p>
              </div>
              <div className="border-b border-border pb-6">
                <h3 className="text-xl font-semibold mb-3">{t('faqs.formats.question')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('faqs.formats.answer')}</p>
              </div>
              <div className="border-b border-border pb-6">
                <h3 className="text-xl font-semibold mb-3">{t('faqs.fileSize.question')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('faqs.fileSize.answer')}</p>
              </div>
              <div className="border-b border-border pb-6">
                <h3 className="text-xl font-semibold mb-3">{t('faqs.batch.question')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('faqs.batch.answer')}</p>
              </div>
              <div className="border-b border-border pb-6">
                <h3 className="text-xl font-semibold mb-3">{t('faqs.quality.question')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('faqs.quality.answer')}</p>
              </div>
              <div className="border-b border-border pb-6">
                <h3 className="text-xl font-semibold mb-3">{t('faqs.free.question')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('faqs.free.answer')}</p>
              </div>
              <div className="border-b border-border pb-6 last:border-0">
                <h3 className="text-xl font-semibold mb-3">{t('faqs.browsers.question')}</h3>
                <p className="text-muted-foreground leading-relaxed">{t('faqs.browsers.answer')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}