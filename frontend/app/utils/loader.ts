import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { API_BASE_URL } from '~/config.server';

export const getApiData = ({ path }: {path?: string} = {}) =>  async ({ request }: LoaderFunctionArgs) => {
  const queryParams = (new URL(request.url).searchParams).toString();
  const { pathname } = new URL(request.url);
  const result = await fetch(
    `${API_BASE_URL}${path || pathname}?${queryParams}`)
    .then(async (res)=>{
      const json = await res.json();
      return json;
    });

  return json(result);
};
