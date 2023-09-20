import type { DataFunctionArgs } from '@remix-run/node';
import { validationError } from 'remix-validated-form';

import { Api } from '~/modules/api/api.server';
import { Auth } from '~/modules/auth/auth.server';
import { validator } from '~/routes/campsites/$slug/schema';
import { getAction } from '~/utils/request-helpers.server';

export const action = async ({ request }: DataFunctionArgs) => {
  if (!await Auth.validateToken(request)) {
    return Auth.unauthorizedResponse(request);
  }
  const { actionType, formData } = await getAction(request);
  let body;

  if (actionType === 'create' || actionType === 'update') {
    const validateResult = await validator.validate(formData);

    if (validateResult.error)
      return validationError(validateResult.error, validateResult.submittedData);

    const { data } = validateResult;
    body = data;
  }

  return await Api.forwardRequest(request, { action: actionType, body });
};
