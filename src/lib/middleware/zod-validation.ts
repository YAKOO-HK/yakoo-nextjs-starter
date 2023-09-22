import { NextRequest } from 'next/server';
import { z } from 'zod';
import { parseRequestBody, parseSearchParams, responseJson } from '@/lib/api-utils';
import 'server-only';

export function withBodyValidation<T extends z.ZodSchema>(
  schema: T,
  handler: (req: NextRequest, body: z.infer<T>, ...args: any[]) => Promise<Response> | Response,
  options: {
    status?: number;
    useSuperJson?: boolean;
  } = {}
) {
  return async function (req: NextRequest, ...args: any[]) {
    try {
      const json = await parseRequestBody(req, options.useSuperJson);
      // console.log(json);
      const body = await schema.parse(json);
      return await handler(req, body, ...args);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return responseJson(error.issues, { status: options.status ?? 422 }, options.useSuperJson);
      }
      throw error;
    }
  };
}

export function withFormDataValidation<T extends z.ZodSchema>(
  schema: T,
  handler: (req: NextRequest, body: z.infer<T>, ...args: any[]) => Promise<Response> | Response,
  options: {
    status?: number;
    useSuperJson?: boolean;
  } = {}
) {
  return async function (req: NextRequest, ...args: any[]) {
    try {
      const formData = await req.formData();
      const body = await schema.parse(formData);
      return await handler(req, body, ...args);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return responseJson(error.issues, { status: options.status ?? 422 }, options.useSuperJson);
      }
      throw error;
    }
  };
}

export function withParamsValidation<T extends z.ZodSchema>(
  schema: T,
  handler: (req: NextRequest, params: z.infer<T>, ...args: any[]) => Promise<Response> | Response,
  options: {
    status?: number;
    useSuperJson?: boolean;
  } = {}
) {
  return async function (req: NextRequest, ctx: any, ...args: any[]) {
    try {
      const params = await schema.parse(ctx.params);
      return await handler(req, params, ctx, ...args);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return responseJson(error.issues, { status: options.status ?? 400 }, options.useSuperJson);
      }
      throw error;
    }
  };
}

export function withSearchParamsValidation<T extends z.ZodSchema>(
  schema: T,
  handler: (req: NextRequest, params: z.infer<T>, ...args: any[]) => Promise<Response> | Response,
  options: {
    status?: number;
    useSuperJson?: boolean;
  } = {}
) {
  return async function (req: NextRequest, ...args: any[]) {
    try {
      const raw = parseSearchParams(req);
      const searchParams = await schema.parse(raw);
      return await handler(req, searchParams, ...args);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return responseJson(error.issues, { status: options.status ?? 400 }, options.useSuperJson);
      }
      throw error;
    }
  };
}
