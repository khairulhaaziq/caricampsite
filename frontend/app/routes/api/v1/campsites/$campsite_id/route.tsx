import type { DataFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { validationError } from 'remix-validated-form';

import { Api } from '~/modules/api/api.server';
import { Auth } from '~/modules/auth/auth.server';
import { Campsite } from '~/modules/campsite/campsite.server';
import { validator } from '~/routes/campsites/new/schema';
import { getAction } from '~/utils/request-helpers.server';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return await Campsite.getCampsite(request, { id: params.campsite_id! });
};

export const action = async ({ request }: DataFunctionArgs) => {
  if (!await Auth.validateToken(request)) {
    return Auth.unauthorizedResponse(request);
  }

  const { searchParams } = new URL(request.url);
  const { actionType, formData } = await getAction(request);

  let redirectTo = searchParams.get('redirectTo') ?? undefined;

  if (actionType === 'create' || actionType === 'update') {
    const validateResult = await validator.validate(formData);
    if (validateResult.error)
      return validationError(validateResult.error, validateResult.submittedData);

    const { data } = validateResult;
    const body = { campsites: data };

    return await Api.forwardRequest(request, {
      action: actionType,
      body,
      redirectTo
    });
  }

  redirectTo = '/';
  const toastMessage = 'Successfully deleted listing!';

  return await Api.forwardRequest(request, {
    action: actionType,
    redirectTo,
    toastMessage
  });
};
