import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faq = z.object({
  question: z.string(),
  answer: z.string(),
});

const agents = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/agents' }),
  schema: z.object({
    title: z.string(),
    navTitle: z.string(),
    order: z.number(),
    transversal: z.boolean().default(false),
    role: z.string(),
    short: z.string(),
    x: z.number(),
    y: z.number(),
    editorial: z.string(),
    situation: z.string(),
    does: z.array(z.string()),
    neverAlone: z.array(z.string()),
    tools: z.array(z.string()),
    result: z.string(),
    safeguards: z.array(z.string()),
    faqs: z.array(faq),
  }),
});

const demos = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/demos' }),
  schema: z.object({
    order: z.number(),
    layout: z.enum(['citation', 'letter', 'timeline', 'ledger']),
    kicker: z.string(),
    title: z.string(),
    href: z.string(),
    sourceLabel: z.string(),
    source: z.string(),
    outputLabel: z.string(),
    output: z.array(z.string()),
    hold: z.string(),
  }),
});

const method = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/method' }),
  schema: z.object({
    editorial: z.string(),
    steps: z.array(
      z.object({
        index: z.string(),
        title: z.string(),
        summary: z.string(),
        detail: z.string(),
      }),
    ),
    support: z.array(
      z.object({
        title: z.string(),
        text: z.string(),
      }),
    ),
  }),
});

const security = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/security' }),
  schema: z.object({
    editorial: z.string(),
    points: z.array(
      z.object({
        label: z.string(),
        text: z.string(),
      }),
    ),
    practice: z.string(),
    journal: z.array(z.string()),
  }),
});

const realisations = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/realisations' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    order: z.number(),
    summary: z.string(),
    body: z.array(z.string()),
    stack: z.array(z.string()),
    note: z.string(),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/home' }),
  schema: z.object({
    hero: z.object({
      kicker: z.string(),
      title: z.string(),
      subtitle: z.string(),
      editorial: z.string(),
      primary: z.string(),
      secondary: z.string(),
    }),
    context: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        detail: z.string(),
      }),
    ),
    problem: z.object({
      kicker: z.string(),
      title: z.string(),
      editorial: z.string(),
      items: z.array(z.string()),
    }),
    constellation: z.object({
      kicker: z.string(),
      title: z.string(),
      editorial: z.string(),
      hint: z.string(),
    }),
    demos: z.object({
      kicker: z.string(),
      title: z.string(),
      editorial: z.string(),
    }),
    method: z.object({
      kicker: z.string(),
      title: z.string(),
      editorial: z.string(),
    }),
    security: z.object({
      kicker: z.string(),
      title: z.string(),
      editorial: z.string(),
    }),
    diagnostic: z.object({
      kicker: z.string(),
      title: z.string(),
      editorial: z.string(),
      text: z.string(),
      price: z.string().nullable(),
      cta: z.string(),
    }),
    contact: z.object({
      kicker: z.string(),
      title: z.string(),
      editorial: z.string(),
      text: z.string(),
    }),
  }),
});

const constellation = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/constellation' }),
  schema: z.object({
    links: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
        label: z.string(),
      }),
    ),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/about' }),
  schema: z.object({
    title: z.string(),
    editorial: z.string(),
    paragraphs: z.array(z.string()),
  }),
});

export const collections = {
  agents,
  demos,
  method,
  security,
  realisations,
  home,
  constellation,
  about,
};
