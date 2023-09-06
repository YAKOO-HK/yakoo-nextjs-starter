import * as z from 'zod';
import { PageableSearchParamsSchema } from '@/types/search';

export const AdminFrontendUserSearchSchema = PageableSearchParamsSchema.extend({
  username: z.string().trim().optional(),
  name: z.string().trim().optional(),
  email: z.string().trim().optional(),
  status: z.literal('').or(z.coerce.number()).optional(),
});
export type AdminFrontendUserSearchParams = z.infer<typeof AdminFrontendUserSearchSchema>;

export const AdminFrontendUserPatchSchema = z.object({
  status: z.coerce.number().optional(),
});
export type AdminFrontendUserPatchFormData = z.infer<typeof AdminFrontendUserPatchSchema>;
