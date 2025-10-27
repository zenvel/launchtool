#!/usr/bin/env node

/**
 * Benchmark table generator for CompressImage comparison pages.
 *
 * This script expects:
 * - Original test assets located in `data/comparison/original`.
 * - Compression results for each tool in `data/comparison/results/<tool>`.
 *   Each directory should contain files with the same file names as the originals.
 *
 * It produces `data/comparison/benchmark-2025Q4.csv` with the following columns:
 * asset,tool,original_bytes,compressed_bytes,compression_rate,notes
 *
 * Usage:
 *   node scripts/comparison/generate-benchmark.mjs
 *
 * Optional flags:
 *   --tools=compressimage,tinypng       # override default tool list
 *   --out=data/comparison/benchmark.csv # override output file path
 */

import { readdir, stat, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const ROOT = resolve(process.cwd())
const ORIGINAL_DIR = join(ROOT, 'data/comparison/original')
const RESULTS_DIR = join(ROOT, 'data/comparison/results')
const DEFAULT_OUTPUT = join(ROOT, 'data/comparison/benchmark-2025Q4.csv')

const DEFAULT_TOOLS = [
  'compressimage',
  'tinypng',
  'shortpixel',
  'kraken',
  'imagify',
]

const parseArgs = () => {
  const args = process.argv.slice(2)
  const options = {
    tools: DEFAULT_TOOLS,
    out: DEFAULT_OUTPUT,
  }

  for (const arg of args) {
    if (arg.startsWith('--tools=')) {
      options.tools = arg.replace('--tools=', '').split(',').map((tool) => tool.trim()).filter(Boolean)
    } else if (arg.startsWith('--out=')) {
      options.out = resolve(ROOT, arg.replace('--out=', '').trim())
    }
  }

  return options
}

const formatRate = (original, compressed) => {
  if (!original || !compressed) return ''
  const reduction = 1 - compressed / original
  return (reduction * 100).toFixed(2) + '%'
}

const buildRow = ({ asset, tool, originalBytes, compressedBytes, notes }) => {
  const rate = formatRate(originalBytes, compressedBytes)
  return [
    asset,
    tool,
    originalBytes ?? '',
    compressedBytes ?? '',
    rate,
    notes ?? '',
  ].join(',')
}

const log = (message) => {
  // eslint-disable-next-line no-console
  console.log(`[benchmark] ${message}`)
}

const ensureDirectories = async () => {
  await Promise.all([ORIGINAL_DIR, RESULTS_DIR].map(async (dir) => {
    try {
      await readdir(dir)
    } catch (error) {
      throw new Error(`Missing directory: ${dir}. Please create it and add test assets.`)
    }
  }))
}

const getOriginalAssets = async () => {
  const items = await readdir(ORIGINAL_DIR)
  return items.filter((file) => !file.startsWith('.')).sort()
}

const getFileSize = async (path) => {
  try {
    const stats = await stat(path)
    return stats.isFile() ? stats.size : undefined
  } catch {
    return undefined
  }
}

const generateBenchmark = async () => {
  const { tools, out } = parseArgs()
  await ensureDirectories()

  const assets = await getOriginalAssets()
  if (assets.length === 0) {
    throw new Error('No assets found in data/comparison/original. Please add test files before running the script.')
  }

  const rows = []
  rows.push('asset,tool,original_bytes,compressed_bytes,compression_rate,notes')

  for (const asset of assets) {
    const originalPath = join(ORIGINAL_DIR, asset)
    const originalBytes = await getFileSize(originalPath)
    if (!originalBytes) {
      log(`Skipping ${asset} (could not determine original size)`)
      continue
    }

    for (const tool of tools) {
      const resultPath = join(RESULTS_DIR, tool, asset)
      const compressedBytes = await getFileSize(resultPath)
      const notes = compressedBytes === undefined ? 'missing_result' : ''
      rows.push(buildRow({
        asset,
        tool,
        originalBytes,
        compressedBytes,
        notes,
      }))
    }
  }

  await writeFile(out, rows.join('\n'), 'utf8')
  log(`Benchmark table generated: ${out}`)
}

generateBenchmark().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[benchmark] Failed to generate table:', error.message)
  process.exitCode = 1
})
