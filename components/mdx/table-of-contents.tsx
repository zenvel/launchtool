"use client"

import * as React from "react"
import { useTranslations } from 'next-intl'
import { cn } from "@/lib/utils"
import { TableOfContents as ToCType } from "@/lib/toc"

interface TocProps {
  toc: ToCType
}

export function TableOfContents({ toc }: TocProps) {
  const t = useTranslations('blog')
  const itemIds = React.useMemo(
    () =>
      toc.items
        ? toc.items
            .flatMap((item) => {
              const childUrls = item.items?.map((child) => child.url ?? "") ?? []
              return [item.url ?? "", ...childUrls]
            })
            .filter((id): id is string => Boolean(id))
            .map((id) => id.split("#")[1])
            .filter((id): id is string => Boolean(id))
        : [],
    [toc]
  )
  const activeHeading = useActiveItem(itemIds)

  if (!toc?.items?.length) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="font-semibold text-sm mb-4">{t('tocHeading')}</p>
      <Tree tree={toc} activeItem={activeHeading} />
    </div>
  )
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!itemIds.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `0% 0% -80% 0%` }
    )

    itemIds?.forEach((id) => {
      if (id) {
        const element = document.getElementById(id)
        if (element) {
          observer.observe(element)
        }
      }
    })

    return () => {
      itemIds?.forEach((id) => {
        if (id) {
          const element = document.getElementById(id)
          if (element) {
            observer.unobserve(element)
          }
        }
      })
    }
  }, [itemIds])

  return activeId
}

interface TreeProps {
  tree: ToCType
  level?: number
  activeItem?: string | null
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return tree?.items?.length && level < 3 ? (
    <ul className={cn("m-2 list-none", { "pl-4": level !== 1 })}>
      {tree.items.map((item, index) => {
        return (
          <li key={item.url ?? index} className={cn("mt-0 pt-2")}>
            <a
              href={item.url ?? "#"}
              className={cn(
                "inline-block no-underline text-sm transition-colors hover:text-foreground",
                item.url === `#${activeItem}`
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree tree={item} level={level + 1} activeItem={activeItem} />
            ) : null}
          </li>
        )
      })}
    </ul>
  ) : null
}
