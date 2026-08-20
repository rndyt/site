import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sharedSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  preview: z.boolean().default(true),
  kind: z.enum(['article', 'note', 'experiment', 'case-study']).default('article'),
  series: reference('series').optional(),
  seriesOrder: z.number().int().positive().optional()
});

const series = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().positive(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['ongoing', 'complete']).default('ongoing'),
    preview: z.boolean().default(true)
  })
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: sharedSchema
});

const ai = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ai' }),
  schema: sharedSchema.extend({
    replay: z.boolean().default(false)
  })
});

const project = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/project' }),
  schema: sharedSchema.extend({
    role: z.string().optional(),
    stack: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([])
  })
});

export const collections = { blog, ai, project, series };
