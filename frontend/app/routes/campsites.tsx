import { useLoaderData, useSearchParams } from '@remix-run/react';

import { getApiData } from '~/utils/loader';

export const loader = getApiData();

export default function Index() {
  const loaderData = useLoaderData();
  const [params, setParams] = useSearchParams();

  function handleChangeParams(page: string) {
    params.set('page', page);
    setParams(params);
  }

  return (
    <div>
      <div>
        <button onClick={()=>handleChangeParams(loaderData.meta?.pagination?.prev_page.toString())} disabled={!loaderData.meta?.pagination?.prev_page}>Previous {loaderData.meta?.pagination?.prev_page}</button>
        <button onClick={()=>handleChangeParams(loaderData.meta?.pagination?.next_page.toString())} disabled={!loaderData.meta?.pagination?.next_page}>Next {loaderData.meta?.pagination?.next_page}</button>
      </div>
      {loaderData && (
        <div>{JSON.stringify(loaderData)}</div>
      )}
    </div>
  );
}
