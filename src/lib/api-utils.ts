import qs from 'qs';
import SuperJSON from 'superjson';

export function responseJson(data: any, init: ResponseInit = {}, useSuperJson = true) {
  return new Response(useSuperJson ? SuperJSON.stringify(data) : JSON.stringify(data), {
    headers: { 'content-type': 'application/json', ...init?.headers },
    status: 200,
    ...init,
  });
}

export async function parseRequestBody(req: Request, useSuperJson = true) {
  return useSuperJson ? SuperJSON.parse(await req.text()) : req.json();
}

export function parseSearchParams(req: Request) {
  const url = new URL(req.url);
  return qs.parse(url.searchParams.toString());
}

interface SimpleOrderBy {
  [key: string]: 'asc' | 'desc' | SimpleOrderBy;
}
export function getOrderBy(sort: string) {
  const sortWithoutMinus = sort.startsWith('-') ? sort.slice(1) : sort;
  const path = sortWithoutMinus.split('.');
  const orderBy: SimpleOrderBy = {};
  let current = orderBy;
  for (let i = 0; i < path.length; i++) {
    const key = path[i] as string;
    if (i === path.length - 1) {
      current[key] = sort.startsWith('-') ? 'desc' : 'asc';
    } else {
      current[key] = {};
      current = current[key] as SimpleOrderBy;
    }
  }
  return orderBy;
}
