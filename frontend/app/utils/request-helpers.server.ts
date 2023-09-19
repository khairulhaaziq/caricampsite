import type { RequestAction } from '~/modules/api/api.server';

export async function getAction(request: Request) {
  const formData = await request.formData();
  const fromFormData = Object.fromEntries(formData);

  let { _action } = fromFormData as { _action: RequestAction };

  if (!_action) {
    const { searchParams } = new URL(request.url);

    _action = searchParams.get('_action') as RequestAction ?? 'create';
  }

  return _action;
}
