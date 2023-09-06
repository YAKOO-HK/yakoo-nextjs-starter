import * as z from 'zod';

export const PageableSearchParamsSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  sort: z.string().trim().optional(),
});
export type PageableSearchParams = z.infer<typeof PageableSearchParamsSchema>;

export interface SortBy {
  key: string;
  asc: boolean;
}

export interface SearchState {
  form: Record<string, unknown>;
  sort: SortBy;
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
}

export interface SearchResult<T> {
  items: T[];
}

export interface SearchApiResult<T> extends SearchResult<T> {
  meta: {
    page: number;
    pageSize: number;
    totalElements: number;
  };
}
