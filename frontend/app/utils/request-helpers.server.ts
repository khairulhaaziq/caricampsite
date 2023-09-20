import type { RequestAction } from '~/modules/api/api.server';

async function getAction(request: Request) {
  const formData = await request.formData();
  const fromFormData = Object.fromEntries(formData);

  let { _action: actionType } = fromFormData as { _action?: RequestAction };

  if (!actionType) {
    const { searchParams } = new URL(request.url);

    actionType = searchParams.get('_action') as RequestAction ?? 'create';
  }

  return { actionType, formData };
}

const getRedirectTo = (request: Request) => {
  const { searchParams } = new URL(request.url);

  const redirectTo = searchParams.get('redirectTo') ?? undefined;

  return redirectTo;
};

export { getAction, getRedirectTo };
