import { type DataFunctionArgs, json } from '@remix-run/node';
import { ofetch } from 'ofetch';
import { validationError } from 'remix-validated-form';

import { API_BASE_URL } from '~/config.server';
import { Auth } from '~/modules/auth/auth.server';
import { validator } from '~/routes/campsites/$slug/schema';

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

  if (_action === 'create_review') {
    const authToken = await Auth.getToken(request);

    const validateResult = await validator.validate(formData);

    if (validateResult.error)
      return validationError(validateResult.error, validateResult.submittedData);

    const { ...body } = validateResult.data;

    const result = await ofetch(
      `${API_BASE_URL}/campsites/${campsite_id}/reviews`, {
        method: 'POST',
        body,
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
    if (error) {
      return json({ error: true, message: result }, { status: 500 });
    }
    return json({ success: true, message: result }, { status: 200 });
  }

  else if (_action === 'update_review') {
    const authToken = await Auth.getToken(request);

    const validateResult = await validator.validate(formData);

    if (validateResult.error)
      return validationError(validateResult.error, validateResult.submittedData);

    const { rating, body } = validateResult.data;

    const result = await ofetch(
      `${API_BASE_URL}/campsites/${campsite_id}/reviews`, {
        method: 'PUT',
        body: { rating, body },
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
    if (error) {
      return json({ error: true, message: result }, { status: 500 });
    }
    return json({ success: true, message: result }, { status: 200 });
  }

  else if (_action === 'delete_review') {
    const authToken = await Auth.getToken(request);

    const result = await ofetch(
      `${API_BASE_URL}/campsites/${campsite_id}/reviews`, {
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
    if (error) {
      return json({ error: true, message: result }, { status: 500 });
    }
    return json({ success: true, message: result }, { status: 200 });
  }

  return json(
    { error: { message: 'Method Not Allowed' } },
    { status: 405 });
};
