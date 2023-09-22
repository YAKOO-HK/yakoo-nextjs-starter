import * as z from 'zod';
import { PageableSearchParamsSchema } from '@/types/search';

export const AdminUserSearchSchema = PageableSearchParamsSchema.extend({
  username: z.string().trim().optional(),
  name: z.string().trim().optional(),
  email: z.string().trim().optional(),
  status: z.literal('').or(z.coerce.number()).optional(),
});
export type AdminUserSearchParams = z.infer<typeof AdminUserSearchSchema>;

export const AdminUserCreateSchema = z.object({
  username: z.string().trim(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  status: z.coerce.number(),
  roleNames: z.array(z.string().trim()),
});
export type AdminUserCreateFormData = z.infer<typeof AdminUserCreateSchema>;

export const AdminUserPatchSchema = z.object({
  status: z.coerce.number().optional(),
});
export type AdminUserPatchFormData = z.infer<typeof AdminUserPatchSchema>;

export const AdminUserPutSchema = z.object({
  username: z.string().trim(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  status: z.coerce.number(),
  roleNames: z.array(z.string().trim()),
});
export type AdminUserPutFormData = z.infer<typeof AdminUserPutSchema>;
