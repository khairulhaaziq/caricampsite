import type { RequestAction } from '~/modules/api/api.server';

export async function getAction(request: Request) {
  const formData = await request.formData();
  const fromFormData = Object.fromEntries(formData);

  let { _action: actionType } = fromFormData as { _action?: RequestAction };

  if (!actionType) {
    const { searchParams } = new URL(request.url);

    actionType = searchParams.get('_action') as RequestAction ?? 'create';
  }

  return { actionType, formData };
}
