import { defineCollections, defineConfig } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    translationKey: z.string().optional(),
    date: z.string(),
    author: z.string(),
    readTime: z.string(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    tldr: z.string().optional(),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
        href: z.string().optional(),
      })
    ).optional(),
    draft: z.boolean().optional(),
  }),
});

export default defineConfig();
