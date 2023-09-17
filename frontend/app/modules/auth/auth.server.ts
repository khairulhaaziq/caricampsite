// eslint-disable-next-line max-len

import { ofetch } from 'ofetch';

import { AUTH_BASE_URL } from '~/config.server';
import { getSession } from '~/utils/sessions.server';

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
}

export { Auth };
