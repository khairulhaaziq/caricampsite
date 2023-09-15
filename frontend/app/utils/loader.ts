import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { API_BASE_URL } from '~/config.server';

export const getApiData = () =>  async ({ request }: LoaderArgs) => {
  const queryParams = (new URL(request.url).searchParams).toString();
  const { pathname } = new URL(request.url);
  const result = await fetch(
    `${API_BASE_URL}${pathname}?${queryParams}`)
    .then(async (res)=>{
      const json = await res.json();
      return json;
    });

  return json(result);
};
