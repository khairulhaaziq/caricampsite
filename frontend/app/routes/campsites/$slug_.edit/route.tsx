import { type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';

import { Auth } from '~/modules/auth/auth.server';
import { Campsite } from '~/modules/campsite/campsite.server';
import CampsiteForm from '~/routes/campsites/new/CampsiteForm';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!await Auth.validateToken(request)) {
    return Auth.unauthorizedResponse(request);
  }

  // TODO: Guard from non admin to be able to edit

  return await Campsite.getCampsite(request, {
    slug: params.slug!,
    query: { view: 'edit' }
  });
};

export default function CampsiteSlugEdit() {
  const { slug } = useParams();
  const { data } = useLoaderData();
  const { attributes } = data;
  const action = `/api/v1/campsites/${data?.id}?_action=update&redirectTo=${`/campsites/${slug}`}`;

  return (
    <CampsiteForm formDefaultValues={attributes} action={action} />
  );
}
