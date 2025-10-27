type DocInfo = {
  path: string
  fullPath: string
}

type DocModule = {
  default: unknown
  frontmatter?: Record<string, unknown>
  toc?: unknown
  structuredData?: unknown
  extractedReferences?: unknown
  lastModified?: Date
  _markdown?: string
}

type RawDocEntry = {
  info: DocInfo
  data: DocModule
}

type RawMetaEntry = {
  info: DocInfo
  data: Record<string, unknown>
}

type RuntimeDocEntry = {
  info: DocInfo
  _exports: DocModule
  body: DocModule['default']
  lastModified?: Date
  toc?: unknown
  structuredData?: unknown
  extractedReferences?: unknown
  getText: () => Promise<string>
} & Record<string, unknown>

const createDocRuntime = (files: RawDocEntry[]): RuntimeDocEntry[] => {
  return files.map(({ info, data }) => {
    const frontmatter =
      data?.frontmatter && typeof data.frontmatter === 'object'
        ? (data.frontmatter as Record<string, unknown>)
        : {}

    const fallbackMarkdown = typeof data?._markdown === 'string' ? data._markdown : ''

    return {
      info,
      _exports: data,
      body: data?.default,
      lastModified: data?.lastModified,
      toc: data?.toc,
      structuredData: data?.structuredData,
      extractedReferences: data?.extractedReferences,
      ...frontmatter,
      async getText() {
        return fallbackMarkdown
      },
    }
  })
}

const createMetaRuntime = (files: RawMetaEntry[]) =>
  files.map(({ info, data }) => ({
    info,
    ...data,
  }))

export const _runtime = {
  doc: createDocRuntime,
  meta: createMetaRuntime,
  docs(docs: RawDocEntry[], metaEntries: RawMetaEntry[]) {
    const parsedDocs = createDocRuntime(docs)
    const parsedMetas = createMetaRuntime(metaEntries)
    return {
      docs: parsedDocs,
      meta: parsedMetas,
      toFumadocsSource() {
        return createMDXSource(parsedDocs, parsedMetas)
      },
    }
  },
}

export const resolveFiles = ({ docs, meta }: { docs: RuntimeDocEntry[]; meta: ReturnType<typeof createMetaRuntime> }) => {
  const outputs = []
  for (const entry of docs) {
    outputs.push({
      type: 'page' as const,
      absolutePath: entry.info.fullPath,
      path: entry.info.path,
      data: entry,
    })
  }
  for (const entry of meta) {
    outputs.push({
      type: 'meta' as const,
      absolutePath: entry.info.fullPath,
      path: entry.info.path,
      data: entry,
    })
  }
  return outputs
}

export const createMDXSource = (docs: RuntimeDocEntry[], meta: ReturnType<typeof createMetaRuntime> = []) => ({
  files: resolveFiles({ docs, meta }),
})
