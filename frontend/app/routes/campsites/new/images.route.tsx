import { type DataFunctionArgs, json } from '@remix-run/node';

import { Auth } from '~/modules/auth/auth.server';
import { commitSession, getSession } from '~/utils/sessions.server';

export const action = async ({ request }: DataFunctionArgs)=> {
  const { method } = request;

  if (method !== 'POST') {
    return json(
      { error: { message: 'Method Not Allowed' } },
      { status: 405 });
  }

  const session = await getSession(
    request.headers.get('Cookie')
  );

  const tokenValidated = await Auth.validateToken(request);

  if (!tokenValidated) {
    session.flash(
      'error',
      'You aren\'t logged in! Log in to create a listing.'
    );

    return json({ message: 'Unauthorized' }, {
      status: 401,
      headers: {
        'Set-Cookie': await commitSession(session),
      }
    });
  }

  const form = await request.formData();

  let result;

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
      result = { ...err, error: true };
    });

  return json({ result });
};
