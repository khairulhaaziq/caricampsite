import { useLoaderData } from '@remix-run/react';

import { getApiData } from '~/utils/loader';

export const loader = getApiData();

export default function Index() {
  const loaderData = useLoaderData();

  return (
    <div>
      {loaderData && (
        <div>{JSON.stringify(loaderData)}</div>
      )}
    </div>
  );
}
