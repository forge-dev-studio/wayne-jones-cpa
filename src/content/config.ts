import { defineCollection, z } from 'astro:content';

const faq = z.array(z.object({ q: z.string(), a: z.string() })).default([]);

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    keywords: z.array(z.string()),
    order: z.number(),
    summary: z.string(),
    serviceType: z.string(),
    relatedServices: z.array(z.string()).default([]),
    whatsIncluded: z.array(z.string()),
    whoItsFor: z.string(),
    faq,
  }),
});

const locations = defineCollection({
  type: 'content',
  schema: z.object({
    city: z.string(),
    state: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    keywords: z.array(z.string()),
    order: z.number(),
    intro: z.string(),
    servicesOffered: z.array(z.string()),
    nearbyAreas: z.array(z.string()).default([]),
    faq,
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    excerpt: z.string(),
    datePublished: z.string(),
    updatedDate: z.string().optional(),
    author: z.string().default('Wayne Jones'),
    category: z.string(),
    keywords: z.array(z.string()),
    draft: z.boolean().default(true),
  }),
});

export const collections = { services, locations, posts };
