"use client"
export const runtime = 'edge'

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from 'next-intl';
import type React from "react";

export default function PricingPage() {
  const t = useTranslations('pricing');

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    console.log("Email submitted for Pro plan notification:", email);
    alert(t('pro.successMessage'));
    (e.target as HTMLFormElement).email.value = "";
  };

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

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* --- FREE TIER --- */}
            <div className="bg-card border border-border rounded-lg p-8 flex flex-col">
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-2">{t('free.name')}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{t('free.price')}</span>
                  <span className="text-muted-foreground">{t('free.period')}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('free.features.unlimitedCompressions')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('free.features.allFormats')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('free.features.clientSide')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('free.features.noWatermarks')}</span>
                  </li>
                </ul>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                {t('free.button')}
              </Button>
            </div>

            {/* --- PRO TIER --- */}
            <div className="bg-card border-2 border-primary rounded-lg p-8 relative flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                {t('pro.badge')}
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-2">{t('pro.name')}</h3>
                <div className="mb-6 h-[48px] flex items-center">
                  <span className="text-2xl font-semibold text-muted-foreground">{t('pro.comingSoon')}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('pro.features.everythingInFree')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('pro.features.unlimitedBatch')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('pro.features.advancedSettings')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('pro.features.prioritySupport')}</span>
                  </li>
                </ul>
              </div>
              <form onSubmit={handleNotifySubmit} className="space-y-2">
                 <Input type="email" name="email" placeholder={t('pro.emailPlaceholder')} required />
                 <Button className="w-full">{t('pro.button')}</Button>
              </form>
            </div>

            {/* --- ENTERPRISE TIER --- */}
            <div className="bg-card border border-border rounded-lg p-8 flex flex-col">
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-2">{t('enterprise.name')}</h3>
                <div className="mb-6 h-[48px] flex items-center">
                  <span className="text-2xl font-semibold">{t('enterprise.price')}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('enterprise.features.everythingInPro')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('enterprise.features.fullApiAccess')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('enterprise.features.customIntegrations')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{t('enterprise.features.dedicatedSupport')}</span>
                  </li>
                </ul>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                {t('enterprise.button')}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}