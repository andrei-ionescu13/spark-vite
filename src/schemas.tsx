import * as z from 'zod';

export const schemas = {
  tag: z.object({
    _id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
  category: z.object({
    _id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
};
