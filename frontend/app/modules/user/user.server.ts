import { ofetch } from 'ofetch';

import { AUTH_BASE_URL } from '~/config.server';
import { getSession } from '~/utils/sessions.server';

class User {
  static async getUser (request: Request) {
    let user = null;

    const session = await getSession(
      request.headers.get('Cookie')
    );

    const tokenSession = session.get('token');

    if (tokenSession) {
      const { token } = tokenSession;

      if (!token) { return; }

      await ofetch(
        `${AUTH_BASE_URL}/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          parseResponse: JSON.parse
        })
        .then((res)=>{
          console.log('user: ', res);
          user=res;
        })
        .catch((err) => {
          console.log('err.data: ', err.data);
        });
    }

    return user;
  }
}

export { User };
