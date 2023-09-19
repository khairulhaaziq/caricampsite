import type { RequestAction } from '~/modules/api/api.server';

export async function getAction(request: Request) {
  const formData = await request.formData();
  const fromFormData = Object.fromEntries(formData);

  const { _action } = fromFormData as { _action: RequestAction };

  return _action;
}
