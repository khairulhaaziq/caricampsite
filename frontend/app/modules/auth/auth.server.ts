// eslint-disable-next-line max-len

import { json } from '@remix-run/node';
import { ofetch } from 'ofetch';

import { AUTH_BASE_URL } from '~/config.server';
import { commitSession, getSession } from '~/utils/sessions.server';

class Auth {
  static async verifyLogin (email: string, password: string) {

    let error = false;

    const result = await ofetch(
      `${AUTH_BASE_URL}/tokens`, {
        method: 'POST',
        body: { email, password },
        parseResponse: JSON.parse
      })
      .catch((err) => {
        error = true;

        return {
          __type: 'Error',
          error: true,
          message: err.data.message,
          statusCode: err.data.code,
        };
      });

    if (error) { return result; }
    const { user } = result;
    const { id, access_token, expires_in, created_at } = user;

    return {
      __type: 'Auth',
      token: access_token,
      exp: created_at + expires_in,
      user: { id, email }
    };
  }

  static async register (email: string, password: string) {

    let error = false;

    const result = await ofetch(
      `${AUTH_BASE_URL}/tokens/register`, {
        method: 'POST',
        body: { email, password },
        parseResponse: JSON.parse
      })
      .catch((err) => {
        error = true;

        return {
          __type: 'Error',
          error: true,
          message: err.data.message,
          statusCode: err.data.code,
        };
      });

    if (error) { return result; }
    const { user } = result;
    const { id, access_token, expires_in, created_at } = user;

    return {
      __type: 'Auth',
      token: access_token,
      exp: created_at + expires_in,
      user: { id, email }
    };
  }

  static async validateToken (request: Request) {
    const session = await getSession(
      request.headers.get('Cookie')
    );

    if (session.has('token')) {
      return true;
    }

    return false;
  }

  static async getToken (request: Request) {
    const session = await getSession(
      request.headers.get('Cookie')
    );

    const tokenSession = session.get('token');

    if (tokenSession)
    {
      const { token } = tokenSession;
      return token;
    }

    return null;
  }

  static async unauthorizedResponse (request: Request) {
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
  }
}

export { Auth };
