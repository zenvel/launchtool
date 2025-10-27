"use client"

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from 'react-compare-slider'
import { useTranslations } from 'next-intl'

interface ImageComparisonSliderProps {
  originalImageUrl: string
  compressedImageUrl: string
  originalSize?: string
  compressedSize?: string
  alt?: string
}

export function ImageComparisonSlider({
  originalImageUrl,
  compressedImageUrl,
  originalSize,
  compressedSize,
  alt = 'Image comparison',
}: ImageComparisonSliderProps) {
  const t = useTranslations('imageProcessing')

  return (
    <div className="relative w-full">
      <ReactCompareSlider
        itemOne={
          <div className="relative h-full w-full">
            <ReactCompareSliderImage
              src={originalImageUrl}
              alt={`${alt} - Original`}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
            />
            {originalSize && (
              <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                {t('original', { size: originalSize })}
              </div>
            )}
          </div>
        }
        itemTwo={
          <div className="relative h-full w-full">
            <ReactCompareSliderImage
              src={compressedImageUrl}
              alt={`${alt} - Compressed`}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
            />
            {compressedSize && (
              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                {t('compressed', { size: compressedSize })}
              </div>
            )}
          </div>
        }
        handle={
          <ReactCompareSliderHandle
            buttonStyle={{
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid white',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'ew-resize',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            linesStyle={{
              backgroundColor: 'white',
              width: '2px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
        }
        position={50}
        className="rounded-lg overflow-hidden aspect-video"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
