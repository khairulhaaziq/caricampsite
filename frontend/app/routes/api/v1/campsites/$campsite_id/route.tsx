import type { type DataFunctionArgs, LoaderFunctionArgs  } from '@remix-run/node';
import { json } from '@remix-run/node';
import { ofetch } from 'ofetch';

import { API_BASE_URL } from '~/config.server';
import { Auth } from '~/modules/auth/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const queryParams = (new URL(request.url).searchParams).toString();

  const { pathname } = new URL(request.url);

  const parsedPathname = parsePath(pathname);

  const result = await fetch(
    `${API_BASE_URL}${parsedPathname}?slug=true&${queryParams}`)
    .then(async (res)=>{
      const json = await res.json();
      return json;
    });

  return json(result);
};

function parsePath(path: string) {
  const parts = path.split('/');

  // Find the index of "campsites" in the split array
  const campsitesIndex = parts.indexOf('v1');

  if (campsitesIndex !== -1) {
    // Join the relevant parts starting from the "campsites" index
    return '/' + parts.slice(campsitesIndex + 1).join('/');
  } else {
    // Handle the case where "campsites" is not found
    return path;
  }
}

export const action = async ({ request, params }: DataFunctionArgs) => {
  const tokenValidated = await Auth.validateToken(request);

  if (!tokenValidated) {
    return Auth.unauthorizedResponse(request);
  }

  const formData = await request.formData();
  const fromFormData = Object.fromEntries(formData);

  const { _action } = fromFormData;

  const error = false;

  // if (_action === 'create_favourite' || _action === 'delete_favourite') {
  //   const authToken = await Auth.getToken(request);

  //   let result;

  //   if (_action === 'create_favourite') {
  //     result = await ofetch(
  //       `${API_BASE_URL}/campsites/${campsite_id}/favourites`, {
  //         method: 'POST',
  //         headers: {
  //           'Authorization': `Bearer ${authToken}`
  //         },
  //         parseResponse: JSON.parse
  //       })
  //       .then((res)=>{
  //         return res;
  //       })
  //       .catch((err) => {
  //         error = true;
  //         return err;
  //       });
  //   } else if (_action === 'delete_favourite') {
  //     result = await ofetch(
  //       `${API_BASE_URL}/campsites/${campsite_id}/favourites`, {
  //         method: 'DELETE',
  //         headers: {
  //           'Authorization': `Bearer ${authToken}`
  //         },
  //         parseResponse: JSON.parse
  //       })
  //       .then((res)=>{
  //         return res;
  //       })
  //       .catch((err) => {
  //         error = true;
  //         return err;
  //       });
  //   }
  //   console.log('result: ', result);

  //   if (error) {
  //     return json({ error: true, message: result }, { status: 500 });
  //   }
  //   return json({ success: true, message: result }, { status: 200 });
  // }

  return json(
    { error: { message: 'Method Not Allowed' } },
    { status: 405 });
};
