"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from 'next/dynamic'
import { X, Download, Minus, Plus } from "lucide-react"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { compressImage, preloadImageCompression, formatFileSize, calculateReduction, type ImageFormat, type CompressionResult } from "@/lib/imageCompression"
import { cn } from "@/lib/utils"
import type { UploadedImage } from "@/app/[locale]/page"
const ImageComparisonSlider = dynamic(
  () =>
    import('@/components/image-comparison-slider').then((mod) => mod.ImageComparisonSlider),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-video rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
        Loading preview...
      </div>
    ),
  }
)

interface ImageProcessingCardProps {
  image: UploadedImage
  onRemove: () => void
}

export function ImageProcessingCard({ image, onRemove }: ImageProcessingCardProps) {
  const [format, setFormat] = useState<ImageFormat>("auto")
  const [quality, setQuality] = useState([80])
  const [progress, setProgress] = useState(0)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isPending, setIsPending] = useState(false) // New state for debounce pending
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const activeResultUrlRef = useRef<string | null>(null)
  const requestIdRef = useRef(0)
  const t = useTranslations('imageProcessing')
  const qualityValue = quality[0] ?? 80

  const formatOptions: Array<{ value: ImageFormat; label: string; hint: string }> = [
    { value: 'auto', label: t('formatAuto'), hint: t('formatAutoHint') },
    { value: 'jpg', label: t('formatJpg'), hint: t('formatJpgHint') },
    { value: 'png', label: t('formatPng'), hint: t('formatPngHint') },
    { value: 'webp', label: t('formatWebp'), hint: t('formatWebpHint') },
    { value: 'avif', label: t('formatAvif'), hint: t('formatAvifHint') },
  ]

  useEffect(() => {
    preloadImageCompression().catch((err) => {
      console.error('Failed to preload compression library:', err)
    })
  }, [])

  // Auto-compress when format or quality changes
  useEffect(() => {
    requestIdRef.current += 1
    const currentRequestId = requestIdRef.current
    const previousResultUrl = activeResultUrlRef.current ?? null

    // Mark as pending immediately when settings change
    setIsPending(true)
    setIsCompressing(true)
    setError(null)
    setProgress(0)

    const compressImageDebounced = async () => {
      if (currentRequestId !== requestIdRef.current) return

      setIsPending(false)

      try {
        const result = await compressImage(
          image.file,
          {
            format,
            quality: quality[0],
            useWebWorker: true,
          },
          (progressValue) => {
            if (currentRequestId === requestIdRef.current) {
              setProgress(progressValue)
            }
          }
        )

        if (currentRequestId !== requestIdRef.current) {
          URL.revokeObjectURL(result.url)
          return
        }

        if (previousResultUrl && previousResultUrl !== result.url) {
          URL.revokeObjectURL(previousResultUrl)
        }

        activeResultUrlRef.current = result.url
        setCompressionResult(result)
        setProgress(100)
      } catch (err) {
        console.error('Compression error:', err)
        if (currentRequestId === requestIdRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to compress image')
          setProgress(0)
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsCompressing(false)
        }
      }
    }

    // Debounce compression to avoid too many calls
    const timeoutId = window.setTimeout(compressImageDebounced, 250)
    return () => {
      clearTimeout(timeoutId)
      if (currentRequestId === requestIdRef.current) {
        setIsPending(false)
        setIsCompressing(false)
      }
    }
  }, [image.file, format, quality])

  useEffect(() => {
    return () => {
      if (activeResultUrlRef.current) {
        URL.revokeObjectURL(activeResultUrlRef.current)
        activeResultUrlRef.current = null
      }
    }
  }, [])

  const handleDownload = () => {
    if (!compressionResult) return

    const link = document.createElement('a')
    link.href = compressionResult.url
    link.download = compressionResult.file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const originalSizeFormatted = formatFileSize(image.originalSize)
  const newSizeFormatted = compressionResult ? formatFileSize(compressionResult.sizeInBytes) : '--'
  const reduction = compressionResult ? calculateReduction(image.originalSize, compressionResult.sizeInBytes) : '--'
  const sizeChangeClass = !compressionResult
    ? 'text-muted-foreground'
    : image.originalSize > 0
      ? compressionResult.sizeInBytes < image.originalSize
        ? 'text-green-500'
        : compressionResult.sizeInBytes > image.originalSize
          ? 'text-red-500'
          : 'text-muted-foreground'
      : 'text-muted-foreground'

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
            <img src={image.thumbnailUrl} alt={image.filename} className="h-full w-full object-cover" />
          </div>
          <span className="text-sm font-medium truncate">{image.filename}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onRemove} className="flex-shrink-0">
          <X className="h-4 w-4" />
          <span className="sr-only">{t('remove')}</span>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Preview Column with Comparison Slider */}
          <div className="space-y-2">
            {compressionResult ? (
              <>
                <div className="text-sm text-muted-foreground mb-2">
                  {t('beforeAfterSlider')}
                  {isPending && <span className="ml-2 text-amber-500">({t('updating')}...)</span>}
                </div>
                <div className={isPending ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
                  <ImageComparisonSlider
                    originalImageUrl={image.thumbnailUrl}
                    compressedImageUrl={compressionResult.url}
                    originalSize={originalSizeFormatted}
                    compressedSize={newSizeFormatted}
                    alt={image.filename}
                  />
                </div>
                {error && (
                  <div className="text-xs text-destructive mt-2">{error}</div>
                )}
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  {t('original', { size: originalSizeFormatted })}
                  {(isPending || isCompressing) && (
                    <span className="text-amber-500">
                      ({t(isPending ? 'updating' : 'compressing')}...)
                    </span>
                  )}
                </div>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  <img
                    src={image.thumbnailUrl}
                    alt={image.filename}
                    className="h-full w-full object-cover"
                  />
                  {(isPending || isCompressing) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="animate-pulse">
                          {t(isPending ? 'updating' : 'compressing')}
                        </span>
                        <span>...</span>
                      </div>
                    </div>
                  )}
                </div>
                {error && (
                  <div className="text-xs text-destructive">{error}</div>
                )}
              </>
            )}
          </div>

          {/* Controls Column */}
          <div>
            <Accordion type="single" collapsible defaultValue="settings" className="w-full">
              <AccordionItem value="settings">
                <AccordionTrigger>{t('compressionSettings')}</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  {/* Format Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">{t('format')}</Label>
                    <RadioGroup
                      value={format}
                      onValueChange={(value) => setFormat(value as ImageFormat)}
                      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                    >
                      {formatOptions.map((option) => (
                        <div key={option.value}>
                          <RadioGroupItem
                            value={option.value}
                            id={`${option.value}-${image.id}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`${option.value}-${image.id}`}
                            className={cn(
                              'flex h-full flex-col gap-1 rounded-xl border border-border bg-background/60 p-3 text-left text-sm transition-all',
                              'hover:border-primary/40 hover:bg-primary/5',
                              'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-sm'
                            )}
                          >
                            <span className="text-base font-semibold text-foreground">{option.label}</span>
                            <span className="text-xs text-muted-foreground peer-data-[state=checked]:text-foreground/80">
                              {option.hint}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Quality Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">{t('quality')}</Label>
                      <span className="text-base font-semibold text-foreground">{qualityValue}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-full sm:h-10 sm:w-10"
                        onClick={() =>
                          setQuality(([current]) => {
                            const next = Math.max(1, (current ?? qualityValue) - 5)
                            return [next]
                          })
                        }
                        aria-label={t('decreaseQuality')}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Slider
                        value={quality}
                        onValueChange={setQuality}
                        min={1}
                        max={100}
                        step={1}
                        className="flex-1"
                        aria-label={t('quality')}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-full sm:h-10 sm:w-10"
                        onClick={() =>
                          setQuality(([current]) => {
                            const next = Math.min(100, (current ?? qualityValue) + 5)
                            return [next]
                          })
                        }
                        aria-label={t('increaseQuality')}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Smart Tip: File Size Increased */}
                  {compressionResult && compressionResult.sizeInBytes > image.originalSize && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-500 text-lg">⚠️</span>
                        <div className="flex-1 text-xs">
                          <p className="font-medium text-amber-500 mb-1">{t('fileSizeIncreased')}</p>
                          <p className="text-muted-foreground">
                            {t('fileSizeIncreasedTip')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Progress value={progress} className="w-full" />
        <div className="flex items-center justify-between w-full">
          <div className="text-sm">
            <span className="text-muted-foreground">{t('newSize')} </span>
            <span className="font-medium">{newSizeFormatted}</span>
            <span className={`ml-2 ${sizeChangeClass}`}>
              ({reduction})
            </span>
          </div>
          <Button
            onClick={handleDownload}
            disabled={!compressionResult || isCompressing || isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('download')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
