import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { API_BASE_URL, INTERNAL_BASE_URL } from '~/config.server';
import { Auth } from '~/modules/auth/auth.server';

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

export const getInternalData = ({ path }: {path?: string} = {}) =>  async ({ request }: LoaderFunctionArgs) => {
  const queryParams = (new URL(request.url).searchParams).toString();
  const { pathname } = new URL(request.url);
  const authToken = await Auth.getToken(request);
  const result = await fetch(
    `${INTERNAL_BASE_URL}${path || pathname}?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    })
    .then(async (res)=>{
      const json = await res.json();
      return json;
    });

  return json(result);
};
