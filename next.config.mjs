import { dirname, join } from 'path'
import createNextIntlPlugin from 'next-intl/plugin'
import { createMDX } from 'fumadocs-mdx/next'
import { fileURLToPath } from 'url'

const withNextIntl = createNextIntlPlugin()
const withMDX = createMDX()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

const edgeRuntimeModule = join(__dirname, 'lib/fumadocs-edge-runtime.ts')

const combinedConfig = withNextIntl(withMDX(nextConfig))
const originalWebpack = combinedConfig.webpack

combinedConfig.webpack = (config, options) => {
  let updatedConfig = config

  if (typeof originalWebpack === 'function') {
    const maybeModified = originalWebpack(config, options)
    if (maybeModified) {
      updatedConfig = maybeModified
    }
  }

  updatedConfig.resolve ??= {}
  updatedConfig.resolve.alias ??= {}
  updatedConfig.resolve.alias['fumadocs-mdx/runtime/next'] = edgeRuntimeModule

  return updatedConfig
}

// 组合多个插件
export default combinedConfig
