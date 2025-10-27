# Comparison Benchmark Dataset

This folder stores shared assets and results for the “CompressImage vs XXX” comparison series.

## Structure

```
data/comparison/
  original/              # Source assets (copy the canonical test set here)
  results/
    compressimage/       # Place CompressImage outputs (same filenames as originals)
    <tool>/              # Additional tool results (TinyPNG, ShortPixel, etc.)
  benchmark-2025Q4.csv   # Generated metrics table (created by the script)
```

> Tip: keep the original assets read-only to avoid accidental overwrites. If you regenerate compressed results, clear the corresponding tool folder first.

## Generating the benchmark table

1. Ensure original assets are available in `data/comparison/original/`.
2. For each tool, export the compressed images into `data/comparison/results/<tool>/` using identical filenames.
3. Run:
   ```bash
   node scripts/comparison/generate-benchmark.mjs
   ```
   You can override the tool list or output path:
   ```bash
   node scripts/comparison/generate-benchmark.mjs --tools=compressimage,tinypng,shortpixel --out=data/comparison/benchmark-tmp.csv
   ```

The generated CSV contains:

```
asset,tool,original_bytes,compressed_bytes,compression_rate,notes
```

Missing results are flagged with `notes = missing_result`. After collecting all numbers, update the comparison articles with the latest CSV data and charts.
