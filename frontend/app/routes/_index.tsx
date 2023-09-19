import {
  Link,
  useFetcher,
  useLoaderData,
  useRouteLoaderData,
  useSearchParams
} from '@remix-run/react';

import IconHeart from '~/components/icons/IconHeart';
import WithTopbar from '~/components/layouts/WithTopbar';
import { getApiData } from '~/utils/loader';

export const loader = getApiData({ path: '/campsites' });

export default function Index() {
  const { data, meta } = useLoaderData();
  const { pagination } = meta;

  return (
    <WithTopbar>
      <div className="flex px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-16">
        <div className="w-full flex flex-col gap-8 pt-8">
          <CategoriesNav />
          {data && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-8">
              {data.map((i, index)=>(
                <ListingItem
                  key={data.id}
                  data={i}
                  index={index}
                />
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <Pagination pagination={pagination} />
          </div>
          {JSON.stringify(data)}
        </div>
      </div>
    </WithTopbar>
  );
}

function CategoriesNav() {
  return (
    <div className="flex justify-center gap-6">
      {[...Array(7).keys()].map((i, index)=>(
        <div key={index} className="flex flex-col items-center gap-1">
          <div
            className="aspect-square h-14 w-14 flex-none bg-gray-200 rounded-lg"
          />
          <p>Category 1</p>
        </div>
      ))}
    </div>
  );
}

function ListingItem({ data, index }) {
  const fetcher = useFetcher();
  const { user } = useRouteLoaderData('root');
  const userData = user?.data;

  return (
    <div className="flex flex-col flex-none gap-2 relative">
      <Link to={`/campsites/${data.attributes.slug}`} className="contents">
        <img
          className="aspect-square w-full flex-none bg-gray-200 rounded-xl object-cover"
          src={`${data.attributes.cover_image}?lock=${index}`}
        />
        <div className="text-sm text-neutral-500">
          <p className="capitalize text-black font-semibold text-base">
            {data.attributes.title}
          </p>
          <p>
            {data.attributes.category_options.map((category, index)=>(
              <span key={category}>
                {category}{ index !== data.attributes.category_options.length - 1 && ', '}
              </span>
            ))}
          </p>
          <p>Jarak</p>
          <p>{data.attributes.rating}</p>
        </div>
      </Link>
      {userData &&
      <fetcher.Form method="POST" action={`/api/v1/campsites/${data.id}/favourites`}>
        <button
          name="_action"
          value={data.attributes.favourites_users.includes(parseInt(userData?.id)) ? 'delete' : 'create'}
          className={`${
            data.attributes.favourites_users.includes(parseInt(userData?.id)) ?
              'text-rose-600' :
              'text-rose-300'
          } active:scale-90 transition-all absolute right-3 top-3`}
        >
          <IconHeart />
        </button>
      </fetcher.Form>}
    </div>

  );
}

function Pagination({ pagination }) {
  const [params, setParams] = useSearchParams();

  function handleChangeParams(page: string) {
    params.set('page', page);
    setParams(params);
  }

  return (<div className="flex gap-2">
    <button
      className="border rounded-md h-10 px-3 border-neutral-300 disabled:text-neutral-300"
      onClick={()=>handleChangeParams(pagination?.prev_page.toString())}
      disabled={!pagination?.prev_page}
    >Previous
    </button>
    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(pageNum=>(
      <button
        key={pageNum}
        className="border rounded-md h-10 px-3 border-neutral-300 disabled:text-neutral-300"
        onClick={()=>handleChangeParams(pagination?.next_page.toString())}
        disabled={pagination?.current_page == pageNum}
      >{pageNum}
      </button>
    ))}
    <button
      className="border rounded-md h-10 px-3 border-neutral-300 disabled:text-neutral-300"
      onClick={()=>handleChangeParams(pagination?.next_page.toString())}
      disabled={!pagination?.next_page}
    >Next
    </button>
  </div>);
}
