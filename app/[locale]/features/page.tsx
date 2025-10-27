"use client"
export const runtime = 'edge'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Zap, Shield, Gauge, ImageIcon, Download, Smartphone } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function FeaturesPage() {
  const t = useTranslations('features')

  const features = [
    { icon: Zap, titleKey: "speed.title", descKey: "speed.description" },
    { icon: Shield, titleKey: "privacy.title", descKey: "privacy.description" },
    { icon: Gauge, titleKey: "quality.title", descKey: "quality.description" },
    { icon: ImageIcon, titleKey: "formats.title", descKey: "formats.description" },
    { icon: Download, titleKey: "batch.title", descKey: "batch.description" },
    { icon: Smartphone, titleKey: "noInstall.title", descKey: "noInstall.description" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              {t('title')}
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t(feature.titleKey)}</h3>
                <p className="text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
