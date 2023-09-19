import { json } from '@remix-run/node';

import { API_BASE_URL } from '~/config.server';

class Campsite {
  static async getCampsite (request: Request, { id, slug, }: { id?: string; slug?: string}) {
    const queryParams = (new URL(request.url).searchParams).toString();

    const result = await fetch(
      `${API_BASE_URL}/campsites/${id ?? slug}${slug && '?slug=true&'}${queryParams}`)
      .then(async (res)=>{
        const json = await res.json();
        return json;
      });

    return json(result);
  }
}

export { Campsite };
