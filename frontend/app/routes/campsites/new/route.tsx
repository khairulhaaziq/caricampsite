import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { ofetch } from 'ofetch';
import { validationError } from 'remix-validated-form';

import { API_BASE_URL } from '~/config.server';
import { Auth } from '~/modules/auth/auth.server';
import { commitSession, getSession } from '~/utils/sessions.server';

import CampsiteForm from './CampsiteForm';
import { validator } from './schema';

export const action = async ({ request }: DataFunctionArgs) => {
  switch (request.method) {
    case 'POST': {
      const session = await getSession(
        request.headers.get('Cookie')
      );

      const tokenValidated = await Auth.validateToken(request);

      if (!tokenValidated) {
        session.flash(
          'error',
          'You need to be logged in to create a listing!'
        );

        return json({ message: 'Unauthorized' }, {
          status: 401,
          headers: {
            'Set-Cookie': await commitSession(session),
          }
        });
      }

      const token = session.get('token')?.token;

      let error = false;

      const formResult = await validator.validate(
        await request.formData()
      );

      if (formResult.error)
        return validationError(formResult.error, formResult.submittedData);

      const { images, ...formData } = formResult.data;

      const attachments_attributes = images.map(url=>({ url, attachment_type: 'campsite-images' }));

      const result = await ofetch(
        `${API_BASE_URL}/campsites`, {
          method: 'POST',
          body: { campsites: { attachments_attributes, ...formData } },
          headers: {
            'Authorization': `Bearer ${token}`
          },
          parseResponse: JSON.parse
        })
        .catch((err) => {
          error = true;
          console.log('error: ', err);

          return {
            __type: 'Error',
            error: true,
            message: err.data?.message,
            statusCode: err.data?.code,
          };
        });

      if (error) {
        session.flash(
          'error',
          'Failed to create a new campsite listing!'
        );

        return json( result, {
          headers: {
            'Set-Cookie': await commitSession(session),
          }
        });
      }

      session.flash(
        'globalMessage',
        'Successfully created a new campsite listing!'
      );

      const newCreatedCampsiteListingSlug = result.data?.attributes?.slug;

      if (!newCreatedCampsiteListingSlug) {
        return json( result, {
          headers: {
            'Set-Cookie': await commitSession(session),
          }
        });
      }

      return redirect( `/campsites/${newCreatedCampsiteListingSlug}`, {
        headers: {
          'Set-Cookie': await commitSession(session),
        }
      });
    }
    default: {
      return json(
        { error: { message: 'Method Not Allowed' } },
        { status: 405 });
    }
  }
};

export default function CampsitesNew() {
  return (
    <CampsiteForm />
  );
}
