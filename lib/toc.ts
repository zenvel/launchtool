import { toc } from "mdast-util-toc"
import { remark } from "remark"
import { visit } from "unist-util-visit"
import type { Node } from "unist"

const textTypes = new Set(["text", "emphasis", "strong", "inlineCode"])

type TocAstNode = Node & {
  url?: string
  value?: string
  children?: TocAstNode[]
}

function flattenNode(node: TocAstNode): string {
  const parts: string[] = []
  visit(node as Node, (child: Node) => {
    const candidate = child as TocAstNode
    if (candidate.type && textTypes.has(candidate.type) && typeof candidate.value === "string") {
      parts.push(candidate.value)
    }
  })
  return parts.join("")
}

interface TocItem {
  title?: string
  url?: string
  items?: TocItem[]
}

interface TocItems {
  items?: TocItem[]
}

function getItems(node: TocAstNode | null | undefined, current: TocItem): TocItem {
  if (!node) {
    return current
  }

  if (node.type === "paragraph") {
    current.title = flattenNode(node)
    node.children?.forEach((child) => {
      if (child.type === "link" && typeof child.url === "string") {
        current.url = child.url
      }
    })

    return current
  }

  if (node.type === "list") {
    const children = node.children ?? []
    const mapped = children
      .map((child) => getItems(child, {}))
      .filter((item) => item.title || (item.items && item.items.length))
    if (mapped.length) {
      current.items = mapped
    }
    return current
  } else if (node.type === "listItem") {
    const children = node.children ?? []
    const heading = getItems(children[0], {})

    if (children.length > 1) {
      getItems(children[1], heading)
    }

    return heading
  }

  return current
}

const getToc =
  () =>
  (node: Node, file: { data: TocItems }) => {
    const table = toc(node)
    const items = getItems(table.map as TocAstNode, {})

    file.data = items
  }

export type TableOfContents = TocItems

export async function getTableOfContents(
  content: string
): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(content)

  return result.data
}
