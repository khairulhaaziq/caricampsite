import type { type DataFunctionArgs, LoaderFunctionArgs  } from '@remix-run/node';
import { json } from '@remix-run/node';
import { ofetch } from 'ofetch';

import { Auth } from '~/modules/auth/auth.server';
import { Campsite } from '~/modules/campsite/campsite.server';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return await Campsite.getCampsite(request, { id: params.campsite_id! });
};

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
