import { json, redirect } from '@remix-run/node';
import { ofetch } from 'ofetch';

import { API_BASE_URL } from '~/config.server';
import { Auth } from '~/modules/auth/auth.server';
import { commitSession, getSession } from '~/utils/sessions.server';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestAction = 'get' | 'create' | 'update' | 'delete'

const MapRequestAction: Record<RequestAction, RequestMethod> = {
  get: 'GET',
  create: 'POST',
  update: 'PUT',
  delete: 'DELETE'
};

interface ForwardRequestOptions {
  body?:any;
  method?: RequestMethod;
  action?: RequestAction;
  redirectTo?: string;
  toastMessage?: string;
}

class Api {
  static async forwardRequest (request: Request, {
    body,
    method,
    action,
    redirectTo,
    toastMessage,
  }: ForwardRequestOptions = {}
  ){
    if (!action && !method) {
      return json(
        { error: { message: 'Method Not Allowed' } },
        { status: 405 });
    }

    const { pathname } = new URL(request.url);
    const parsedPathname = parsePath(pathname);

    const inferredMethod: RequestMethod = action ?
      MapRequestAction[action] : method ? method : 'POST';

    const authToken = await Auth.getToken(request);

    let error = false;

    const result = await ofetch(
      `${API_BASE_URL}${parsedPathname}`, {
        method: inferredMethod,
        body: body,
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        parseResponse: JSON.parse
      })
      .then((json)=>{
        if (json?.code !== 200) {
          throw new Error(JSON.stringify(json));
        }
        return json;
      })
      .catch((err) => {
        error = true;
        console.error('error: ', err);
        return err;
      });

    if (error) {
      return json({ error: true, message: result }, { status: 500 });
    }

    if (redirectTo) {
      if (toastMessage) {
        const session = await getSession(
          request.headers.get('Cookie')
        );

        session.flash(
          'globalMessage',
          toastMessage
        );

        return redirect(redirectTo, {
          headers: {
            'Set-Cookie': await commitSession(session),
          },
        });
      }
      return redirect(redirectTo);
    }
    return json({ success: true, message: result }, { status: 200 });
  }
}


function parsePath(path: string) {
  const withoutQuery = path.split('?');
  const parts = withoutQuery[0].split('/');

  // Find the index of 'v1' in the path
  const campsitesIndex = parts.indexOf('v1');

  if (campsitesIndex !== -1) {
    // Check if there's a part after 'v1'
    if (campsitesIndex + 1 < parts.length) {
      // Join all parts after 'v1' and return the result
      return '/' + parts.slice(campsitesIndex + 1).join('/');
    } else {
      // If there are no parts after 'v1', return '/' to avoid 'undefined'
      return '/';
    }
  } else {
    return path;
  }
}

export { Api };
