"use client"
export const runtime = 'edge'

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useTranslations } from 'next-intl'

// The component containing the actual page logic.
function ContactPageContent() {
  const searchParams = useSearchParams()
  const t = useTranslations('contact')

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [pageContent, setPageContent] = useState({
    title: t('title'),
    subtitle: t('subtitle'),
  })

  useEffect(() => {
    const intent = searchParams.get("intent")

    if (intent === "feedback") {
      setPageContent({
        title: t('feedback.title'),
        subtitle: t('feedback.subtitle'),
      })
      setFormData((prev) => ({ ...prev, subject: t('form.feedbackSubject') }))
    } else if (intent === "support") {
      setPageContent({
        title: t('support.title'),
        subtitle: t('support.subtitle'),
      })
      setFormData((prev) => ({ ...prev, subject: t('form.supportSubject') }))
    }
  }, [searchParams, t])

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      subject: "",
      message: "",
    }

    let isValid = true

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = t('form.errors.nameRequired')
      isValid = false
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = t('form.errors.emailRequired')
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('form.errors.emailInvalid')
      isValid = false
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = t('form.errors.subjectRequired')
      isValid = false
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = t('form.errors.messageRequired')
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    console.log("Contact form submitted:", formData)
    alert(t('form.successMessage'))
    setFormData({ name: "", email: "", subject: "", message: "" })
    setErrors({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">{pageContent.title}</h1>
            <p className="text-xl text-muted-foreground mb-12 text-balance">
              {pageContent.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <Label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t('form.name')}
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('form.namePlaceholder')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('form.email')}
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('form.emailPlaceholder')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="subject" className="block text-sm font-medium mb-2">
                  {t('form.subject')}
                </Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={t('form.subjectPlaceholder')}
                  className={errors.subject ? 'border-red-500' : ''}
                />
                {errors.subject && (
                  <p className="text-sm text-red-500 mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <Label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('form.message')}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('form.messagePlaceholder')}
                  className={`resize-none ${errors.message ? 'border-red-500' : ''}`}
                />
                {errors.message && (
                  <p className="text-sm text-red-500 mt-1">{errors.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                {t('form.submit')}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

// The main page component that wraps our logic component in a Suspense boundary.
export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactPageContent />
    </Suspense>
  )
}