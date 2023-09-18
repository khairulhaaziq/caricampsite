import {
  Link,
  useLoaderData,
  useSearchParams
} from '@remix-run/react';

import WithTopbar from '~/components/layouts/WithTopbar';
import { getApiData } from '~/utils/loader';

export const loader = getApiData({ path: '/campsites' });

export default function Index() {
  const { data, meta } = useLoaderData();
  const { pagination } = meta;
  const [params, setParams] = useSearchParams();

  function handleChangeParams(page: string) {
    params.set('page', page);
    setParams(params);
  }

  return (
    <WithTopbar>
      <div className="flex px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pb-16 pt-20">
        <div className="w-full flex flex-col gap-8 pt-8">
          <CategoriesNav />
          {data && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-8">
                {data.map((i, index)=>(
                  <Link key={i.id} to={`/campsites/${i.attributes.slug}`}>
                    <div className="flex flex-col flex-none gap-2">
                      <img
                        className="aspect-square w-full flex-none bg-gray-200 rounded-xl object-cover"
                        src={`${i.attributes.cover_image}?lock=${index}`}
                      />
                      <div className="text-sm text-neutral-500">
                        <p className="capitalize text-base text-black font-medium">
                          {i.attributes.name}
                        </p>
                        <p>
                          {i.attributes.category_options.map((category, index)=>(
                            <span key={category}>
                              {category}{ index !== i.attributes.category_options.length - 1 && ', '}
                            </span>
                          ))}
                        </p>
                        <p>Jarak</p>
                        <p>{i.attributes.rating}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <div className="flex gap-2">
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
            </div>
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
