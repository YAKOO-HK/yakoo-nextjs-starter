import { z } from 'zod';

export const TotpConfigSchema = z.object({
  secretSize: z.number().optional(),
  period: z.number().optional(),
  digits: z.number().optional(),
  algo: z.enum(['sha1', 'sha256', 'sha512']).optional(),
});

export const TotpUpdateSchema = z.object({
  secret: z.string().trim(),
  config: TotpConfigSchema,
});
