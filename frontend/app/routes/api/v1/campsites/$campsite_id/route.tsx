import {
  type DataFunctionArgs,
  json,
  type LoaderFunctionArgs
} from '@remix-run/node';
import { validationError } from 'remix-validated-form';

import type { RequestAction } from '~/modules/api/api.server';
import { Api } from '~/modules/api/api.server';
import { Campsite } from '~/modules/campsite/campsite.server';
import { validator } from '~/routes/campsites/new/schema';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return await Campsite.getCampsite(request, { id: params.campsite_id! });
};

export const action = async ({ request }: DataFunctionArgs) => {
  // if (!await Auth.validateToken(request)) {
  //   return Auth.unauthorizedResponse(request);
  // }

  const { searchParams } = new URL(request.url);
  const formData = await request.formData();

  let { _action: action } = Object.fromEntries(formData);
  let redirectTo = searchParams.get('redirectTo') ?? undefined;

  if (!action) {

    action = searchParams.get('_action') as RequestAction ?? 'create';
  }

  if (action === 'create' || action === 'update') {
    let body;

    const validateResult = await validator.validate(formData);

    if (validateResult.error)
      return validationError(validateResult.error, validateResult.submittedData);

    const { data } = validateResult;
    body = { campsites: data };

    return await Api.forwardRequest(request, { action, body, redirectTo });
  }

  redirectTo = '/';
  const toastMessage = 'Successfully deleted listing!';

  return await Api.forwardRequest(request, {
    action,
    redirectTo,
    toastMessage
  });
};
