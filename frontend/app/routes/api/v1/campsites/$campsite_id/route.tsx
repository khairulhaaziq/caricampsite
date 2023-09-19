import { type DataFunctionArgs, json } from '@remix-run/node';
import { ofetch } from 'ofetch';

import { API_BASE_URL } from '~/config.server';
import { Auth } from '~/modules/auth/auth.server';

export const action = async ({ request, params }: DataFunctionArgs) => {
  const { campsite_id } = params;
  const tokenValidated = await Auth.validateToken(request);

  if (!tokenValidated) {
    return Auth.unauthorizedResponse(request);
  }

  const formData = await request.formData();
  const fromFormData = Object.fromEntries(formData);

  const { _action } = fromFormData;

  let error = false;

  if (_action === 'add_favourite' || _action === 'remove_favourite') {
    const authToken = await Auth.getToken(request);

    let result;

    if (_action === 'add_favourite') {
      result = await ofetch(
        `${API_BASE_URL}/campsites/${campsite_id}/favourites`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          parseResponse: JSON.parse
        })
        .then((res)=>{
          return res;
        })
        .catch((err) => {
          error = true;
          return err;
        });
    } else if (_action === 'remove_favourite') {
      result = await ofetch(
        `${API_BASE_URL}/campsites/${campsite_id}/favourites`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          parseResponse: JSON.parse
        })
        .then((res)=>{
          return res;
        })
        .catch((err) => {
          error = true;
          return err;
        });
    }
    console.log('result: ', result);

    if (error) {
      return json({ error: true, message: result }, { status: 500 });
    }
    return json({ success: true, message: result }, { status: 200 });
  }

  return json(
    { error: { message: 'Method Not Allowed' } },
    { status: 405 });
};
