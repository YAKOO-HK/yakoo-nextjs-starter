import pickBy from 'lodash-es/pickBy';
import querystring from 'qs';
import SuperJSON from 'superjson';

export async function parseJson<T = any>(response: Response, useSuperJSON = true): Promise<T> {
  if (useSuperJSON) {
    return SuperJSON.parse<T>(await response.text());
  }
  return (await response.json()) as T;
}

export function fetchResponseHandler<TReturn = any>(useSuperJSON = true) {
  return async (response: Response): Promise<TReturn> => {
    if (response.ok) {
      return await parseJson(response, useSuperJSON);
    }
    let data = null;
    try {
      data = await parseJson(response, useSuperJSON);
    } catch (e) {
      // no response body
    }
    return Promise.reject({
      status: response.status,
      statusText: response.statusText,
      data,
    });
  };
}

export function buildQuery(
  search: {
    form: any; // TODO: typed with search form?
    page: number;
    pageSize: number;
    sort?: { asc: boolean; key: string };
  },
  sendEmpty?: false
) {
  let data = {
    ...search.form,
    page: search.page ? search.page : null, // we stored page zero-based.
    pageSize: search.pageSize ? search.pageSize : null,
  };
  if (search.sort?.key) {
    data.sort = `${search.sort.asc ? '' : '-'}${search.sort.key}`;
  }

  // remove empty array
  data = pickBy(
    data,
    // filter empty array as querystring have strange behavior
    (value) => (Array.isArray(value) ? Boolean(value.length) : true)
  );
  if (!sendEmpty) {
    // remove empty input to shorten the params
    data = pickBy(
      data,
      // filter empty array as querystring have strange behavior
      (value) => Boolean(value) || value === 0 || value == false
    );
  }
  return querystring.stringify(data, { arrayFormat: 'repeat' });
}
