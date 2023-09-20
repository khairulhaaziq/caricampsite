import { type DataFunctionArgs } from '@remix-run/node';

import { Api } from '~/modules/api/api.server';
import { Auth } from '~/modules/auth/auth.server';
import { getAction } from '~/utils/request-helpers.server';

export const action = async ({ request }: DataFunctionArgs) => {

  if (!await Auth.validateToken(request)) {
    return Auth.unauthorizedResponse(request);
  }

  const { actionType } = await getAction(request);

  return await Api.forwardRequest(request, { action: actionType });
};
