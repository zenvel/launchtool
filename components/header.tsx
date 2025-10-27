"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Link } from '@/routing'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

export function Header() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const t = useTranslations('header')
  const tCommon = useTranslations('common')
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = mounted && resolvedTheme === 'light'
    ? '/branding/logo-light.png'
    : '/branding/logo-dark.png'

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src={logoSrc}
              alt={tCommon('compressImage')}
              width={120}
              height={120}
              priority
              className="h-8 w-auto"
            />
            <span className="text-lg font-semibold">{tCommon('compressImage')}</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 mr-2">
              <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('whyUs')}
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('blog')}
              </Link>
            </nav>
            <ThemeToggle />
            <LanguageSwitcher />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{tCommon('toggleMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/features"
                    className="text-lg text-foreground hover:text-accent transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {t('whyUs')}
                  </Link>
                  <Link
                    href="/blog"
                    className="text-lg text-foreground hover:text-accent transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {t('blog')}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
