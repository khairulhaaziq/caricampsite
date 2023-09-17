import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';

import { destroySession, getSession } from '~/utils/sessions.server';

export const action = async ({ request }: DataFunctionArgs) => {
  if (request.method !== 'POST') {
    return json(
      { error: { message: 'Method Not Allowed' } },
      { status: 405 });
  }

  const session = await getSession(
    request.headers.get('Cookie')
  );

  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};
