import { format } from 'date-fns';
import * as z from 'zod';
import { PageableSearchParamsSchema } from '@/types/search';

export const AdminFrontendUserSearchSchema = PageableSearchParamsSchema.extend({
  username: z.string().trim().optional(),
  name: z.string().trim().optional(),
  email: z.string().trim().optional(),
  status: z.literal('').or(z.coerce.number()).optional(),
  dob: z
    .preprocess(
      (val) => (val instanceof Date ? format(val, 'yyyy-MM-dd') : val),
      z.string().regex(/^(19|20)\d{2}-(0[1-9]|1[0-2])-([0-2][1-9]|3[0-2])$/, { message: 'Invalid Date' })
    )
    .nullish(),
});
export type AdminFrontendUserSearchParams = z.infer<typeof AdminFrontendUserSearchSchema>;

export const AdminFrontendUserPatchSchema = z.object({
  status: z.coerce.number().optional(),
});
export type AdminFrontendUserPatchFormData = z.infer<typeof AdminFrontendUserPatchSchema>;

export const AdminFrontendUserPutSchema = z.object({
  username: z.string().trim(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  dob: z
    .preprocess(
      (val) => (val instanceof Date ? format(val, 'yyyy-MM-dd') : val),
      z.string().regex(/^(19|20)\d{2}-(0[1-9]|1[0-2])-([0-2][1-9]|3[0-2])$/, { message: 'Invalid Date' })
    )
    .nullable(),
  status: z.coerce.number(),
});
export type AdminFrontendUserPutFormData = z.infer<typeof AdminFrontendUserPutSchema>;
