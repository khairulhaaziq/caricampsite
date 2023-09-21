import { json } from '@remix-run/node';

import { API_BASE_URL, INTERNAL_BASE_URL } from '~/config.server';

class Campsite {
  static async getCampsite (request: Request, { id, slug, query }: { id?: string; slug?: string; query?: any}) {
    const prefix = slug ? '' : '?';
    const queryParams = prefix + new URLSearchParams(query).toString();
    const url = `${API_BASE_URL}/campsites/${id ?? slug}${slug && '?slug=true&'}${queryParams}`;

    let error = false;

    const result = await fetch(url)
      .then(async (res)=>{
        const json = await res.json();
        return json;
      })
      .catch((err)=>{
        console.error(err);
        error = true;
      });

    if (error)
      return json({ message: 'getCampsite failed', error: true }, { status: 500 });

    return json(result);
  }

  static async getCampsitePageData (request: Request, { id, slug, query }: { id?: string; slug?: string; query?: any}) {
    const prefix = slug ? '' : '?';
    const queryParams = prefix + new URLSearchParams(query).toString();
    const url = `${INTERNAL_BASE_URL}/campsites/${id ?? slug}${slug && '?slug=true&'}${queryParams}`;

    let error = false;

    const result = await fetch(url)
      .then(async (res)=>{
        const json = await res.json();
        return json;
      })
      .catch((err)=>{
        console.error(err);
        error = true;
      });

    if (error)
      return json({ message: 'getCampsite failed', error: true }, { status: 500 });

    return json(result);
  }
}

export { Campsite };
