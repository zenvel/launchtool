#!/bin/bash

# 博客文章创建脚本
# 使用方法: ./scripts/new-post.sh "Article Title" [en|zh]
#
# 示例:
#   ./scripts/new-post.sh "10 Tips for Image Optimization" en
#   ./scripts/new-post.sh "图片优化的10个技巧" zh

set -e

# 检查参数
if [ $# -lt 1 ]; then
    echo "❌ 错误: 缺少文章标题"
    echo ""
    echo "使用方法: ./scripts/new-post.sh \"Article Title\" [en|zh]"
    echo ""
    echo "示例:"
    echo "  ./scripts/new-post.sh \"10 Tips for Image Optimization\" en"
    echo "  ./scripts/new-post.sh \"图片优化的10个技巧\" zh"
    exit 1
fi

TITLE=$1
LANG=${2:-en}  # 默认英文
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')
DATE=$(date +%Y-%m-%d)
FILE_PATH="content/blog/$LANG/$SLUG.mdx"

# 检查文件是否已存在
if [ -f "$FILE_PATH" ]; then
    echo "❌ 错误: 文件已存在: $FILE_PATH"
    exit 1
fi

# 确保目录存在
mkdir -p "content/blog/$LANG"

# 创建文件
cat > "$FILE_PATH" <<EOF
---
title: "$TITLE"
description: "TODO: Add a compelling description (150-160 characters for SEO)"
translationKey: "$SLUG"
date: "$DATE"
author: "CompressImage Team"
readTime: "5 min read"
category: Guides
tags:
  - TODO-tag
image: "/branding/og-default.png"
tldr: "TODO: Summarize the key outcome in one or two sentences."
faqs:
  - question: "TODO: Question 1?"
    answer: "TODO: Provide a clear, concise answer."
  - question: "TODO: Question 2?"
    answer: "TODO: Provide a clear, concise answer."
---

TODO: Write your article content here...

## Introduction

Start with a compelling introduction that hooks the reader.

## Main Content

### Section 1

Content here...

### Section 2

Content here...

## Conclusion

Summarize the key points and provide actionable takeaways.

---

**Related Articles:**
- [Link to related article 1](#)
- [Link to related article 2](#)
EOF

echo "✅ 创建成功: $FILE_PATH"
echo ""
echo "📝 下一步:"
echo "1. 编辑文件: vi $FILE_PATH"
echo "2. 更新 title, description, readTime"
echo "3. 编写文章内容"
echo "4. 运行 pnpm dev 查看预览"

if [ "$LANG" = "en" ]; then
    echo ""
    echo "💡 提示: 完成后可以使用 AI 翻译成中文:"
    echo "   ./scripts/new-post.sh \"$(echo $TITLE | sed 's/"/\\"/g')\" zh"
elif [ "$LANG" = "zh" ]; then
    echo ""
    echo "💡 提示: 完成后可以使用 AI 翻译成英文:"
    echo "   ./scripts/new-post.sh \"[English Title]\" en"
fi
