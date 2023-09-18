import { type DataFunctionArgs, json } from '@remix-run/node';

import { Auth } from '~/modules/auth/auth.server';

export const action = async ({ request }: DataFunctionArgs)=> {
  const { method } = request;

  if (method !== 'POST') {
    return json(
      { error: { message: 'Method Not Allowed' } },
      { status: 405 });
  }

  const tokenValidated = await Auth.validateToken(request);

  if (!tokenValidated) {
    return Auth.unauthorizedResponse(request);
  }

  const form = await request.formData();

  let result;
  let error = false;

  await fetch(process.env.S3_API_ENDPOINT!,
    {
      method: 'POST',
      headers: {
        S3_UPLOAD_USERNAME: process.env.S3_UPLOAD_USERNAME!,
        S3_UPLOAD_PASSWORD: process.env.S3_UPLOAD_PASSWORD!,
      },
      mode: 'cors',
      credentials: 'include',
      body: form,
    })
    .then(async (res) => {
      const json = await res.json();
      console.log(json);
      result = { ...json, success: true };
    })
    .catch((err) =>{
      console.error(err);
      error = true;
      result = { ...err, error: true };
    });

  const status = error ? 500 : 200;

  return json({ result }, { status });
};
