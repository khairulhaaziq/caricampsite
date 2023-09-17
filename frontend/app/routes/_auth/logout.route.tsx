import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';

import {
  commitSession,
  destroySession,
  getSession
} from '~/utils/sessions.server';

export const action = async ({ request }: DataFunctionArgs) => {
  if (request.method !== 'POST') {
    return json(
      { error: { message: 'Method Not Allowed' } },
      { status: 405 });
  }

  let session = await getSession(
    request.headers.get('Cookie')
  );

  await destroySession(session);

  session = await getSession();

  session.flash(
    'globalMessage',
    'Successfully logged out!'
  );

  return redirect('/login', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};
