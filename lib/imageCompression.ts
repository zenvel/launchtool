export type ImageFormat = 'auto' | 'jpg' | 'png' | 'webp' | 'avif'

export interface CompressionOptions {
  format: ImageFormat
  quality: number // 1-100
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
}

export interface CompressionResult {
  blob: Blob
  file: File
  url: string
  sizeInBytes: number
  sizeInKB: number
  sizeInMB: number
}

let imageCompressionModulePromise: Promise<typeof import('browser-image-compression')> | null = null

async function loadImageCompression() {
  if (!imageCompressionModulePromise) {
    imageCompressionModulePromise = import('browser-image-compression')
  }
  return imageCompressionModulePromise
}

export function preloadImageCompression() {
  return loadImageCompression().catch(() => {
    imageCompressionModulePromise = null
  })
}

/**
 * Convert format string to MIME type
 */
function formatToMimeType(format: ImageFormat, originalType: string): string {
  switch (format) {
    case 'jpg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'avif':
      return 'image/avif'
    case 'auto':
    default:
      // Keep original format or default to JPEG for unknown types
      if (originalType.includes('png')) return 'image/png'
      if (originalType.includes('webp')) return 'image/webp'
      if (originalType.includes('avif')) return 'image/avif'
      return 'image/jpeg'
  }
}

/**
 * Get file extension from format
 */
function getFileExtension(format: ImageFormat, originalName: string): string {
  const originalExt = originalName.split('.').pop()?.toLowerCase()

  switch (format) {
    case 'jpg':
      return 'jpg'
    case 'png':
      return 'png'
    case 'webp':
      return 'webp'
    case 'avif':
      return 'avif'
    case 'auto':
    default:
      return originalExt || 'jpg'
  }
}

/**
 * Compress an image file with specified options
 *
 * For AVIF format: browser-image-compression doesn't support AVIF natively,
 * so we need to use Canvas API for conversion
 */
export async function compressImage(
  file: File,
  options: CompressionOptions,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const { format, quality } = options

  try {
    // Handle AVIF format separately using Canvas API
    if (format === 'avif') {
      return await compressToAVIF(file, quality, onProgress)
    }

    // For other formats, use browser-image-compression
    const targetMimeType = formatToMimeType(format, file.type)

    const compressionOptions = {
      maxSizeMB: options.maxSizeMB,
      maxWidthOrHeight: options.maxWidthOrHeight,
      useWebWorker: options.useWebWorker !== false, // Default to true
      quality: quality / 100, // Convert 1-100 to 0-1
      fileType: targetMimeType,
      onProgress: (progress: number) => {
        if (onProgress) {
          onProgress(progress)
        }
      },
    }

    const { default: imageCompression } = await loadImageCompression()
    const compressedBlob = await imageCompression(file, compressionOptions)

    // Create new file with correct extension
    const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
    const newExtension = getFileExtension(format, file.name)
    const newFileName = `${originalNameWithoutExt}.${newExtension}`

    const compressedFile = new File([compressedBlob], newFileName, {
      type: targetMimeType,
      lastModified: Date.now(),
    })

    const url = URL.createObjectURL(compressedBlob)
    const sizeInBytes = compressedBlob.size

    return {
      blob: compressedBlob,
      file: compressedFile,
      url,
      sizeInBytes,
      sizeInKB: sizeInBytes / 1024,
      sizeInMB: sizeInBytes / (1024 * 1024),
    }
  } catch (error) {
    console.error('Image compression failed:', error)
    throw new Error(`Failed to compress image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Compress image to AVIF format using Canvas API
 * Note: AVIF support depends on browser compatibility
 */
async function compressToAVIF(
  file: File,
  quality: number,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to read file'))
        return
      }

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }

          ctx.drawImage(img, 0, 0)

          if (onProgress) onProgress(50)

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to convert to AVIF. Your browser may not support AVIF format.'))
                return
              }

              if (onProgress) onProgress(100)

              const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
              const newFileName = `${originalNameWithoutExt}.avif`

              const compressedFile = new File([blob], newFileName, {
                type: 'image/avif',
                lastModified: Date.now(),
              })

              const url = URL.createObjectURL(blob)
              const sizeInBytes = blob.size

              resolve({
                blob,
                file: compressedFile,
                url,
                sizeInBytes,
                sizeInKB: sizeInBytes / 1024,
                sizeInMB: sizeInBytes / (1024 * 1024),
              })
            },
            'image/avif',
            quality / 100
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = e.target.result as string
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Calculate size reduction percentage
 */
export function calculateReduction(originalSize: number, compressedSize: number): string {
  if (originalSize <= 0) {
    return '--'
  }

  const reduction = ((originalSize - compressedSize) / originalSize) * 100
  return reduction > 0 ? `-${reduction.toFixed(1)}%` : `+${Math.abs(reduction).toFixed(1)}%`
}

/**
 * Check if browser supports AVIF format
 */
export async function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const avifImage = new Image()
    avifImage.onload = () => resolve(true)
    avifImage.onerror = () => resolve(false)
    avifImage.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
  })
}
