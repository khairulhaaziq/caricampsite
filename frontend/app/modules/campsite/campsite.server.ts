import { json } from '@remix-run/node';

import { API_BASE_URL } from '~/config.server';

class Campsite {
  static async getCampsite (request: Request, { id, slug, query }: { id?: string; slug?: string; query?: any}) {
    const prefix = slug ? '' : '?';
    const queryParams = prefix + new URLSearchParams(query).toString();
    const url = `${API_BASE_URL}/campsites/${id ?? slug}${slug && '?slug=true&'}${queryParams}`;

    console.log('url', url);
    const result = await fetch(url)
      .then(async (res)=>{
        const json = await res.json();
        return json;
      });

    return json(result);
  }
}

export { Campsite };
