import type { DataFunctionArgs } from '@remix-run/node';
import { validationError } from 'remix-validated-form';

import { Api } from '~/modules/api/api.server';
import { Auth } from '~/modules/auth/auth.server';
import { validator } from '~/routes/campsites/$slug/schema';

export const action = async ({ request }: DataFunctionArgs) => {

  if (!await Auth.validateToken(request)) {
    return Auth.unauthorizedResponse(request);
  }

  const formData = await request.formData();

  const { _action: action } = Object.fromEntries(formData);
  let body;

  if (action === 'create' || action === 'update') {
    const validateResult = await validator.validate(formData);

    if (validateResult.error)
      return validationError(validateResult.error, validateResult.submittedData);

    const { data } = validateResult;
    body = data;
  }

  return await Api.forwardRequest(request, { action, body });
};
