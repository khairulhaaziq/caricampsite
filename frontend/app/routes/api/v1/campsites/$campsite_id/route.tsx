import type { type DataFunctionArgs, LoaderFunctionArgs  } from '@remix-run/node';

import { Api } from '~/modules/api/api.server';
import { Auth } from '~/modules/auth/auth.server';
import { Campsite } from '~/modules/campsite/campsite.server';
import { getAction } from '~/utils/request-helpers.server';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return await Campsite.getCampsite(request, { id: params.campsite_id! });
};

export const action = async ({ request }: DataFunctionArgs) => {
  if (!await Auth.validateToken(request)) {
    return Auth.unauthorizedResponse(request);
  }

  const action = await getAction(request);

  return await Api.forwardRequest(request, {
    action,
    redictTo: '/',
    toastMessage: 'Successfully deleted listing!'
  });
};
