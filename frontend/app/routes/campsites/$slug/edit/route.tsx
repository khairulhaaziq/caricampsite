import type { LoaderFunctionArgs } from '@remix-run/node';

import { Campsite } from '~/modules/campsite/campsite.server';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { slug } = params as {slug: string};

  return await Campsite.getCampsite(request, { slug });
};

export default function CampsiteSlugEdit() {
  return (
    <div></div>
  );
}
