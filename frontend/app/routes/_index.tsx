import { type DataFunctionArgs, json } from '@remix-run/node';
import {
  Link,
  useFetcher,
  useLoaderData,
  useRouteLoaderData,
  useSearchParams
} from '@remix-run/react';
import { ofetch } from 'ofetch';

import WithTopbar from '~/components/layouts/WithTopbar';
import { API_BASE_URL } from '~/config.server';
import { Auth } from '~/modules/auth/auth.server';
import { getApiData } from '~/utils/loader';

export const loader = getApiData({ path: '/campsites' });

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();

  const body = Object.fromEntries(formData);
  const { _action } = body;

  if (_action === 'add_favourite' || _action === 'remove_favourite') {
    const { campsite_id } = body;

    let error = false;

    const authToken = await Auth.getToken(request);

    let result;

    if (_action === 'add_favourite') {
      result = await ofetch(
        `${API_BASE_URL}/campsites/${campsite_id}/favourites`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          parseResponse: JSON.parse
        })
        .then((res)=>{
          return res;
        })
        .catch((err) => {
          error = true;
          return err;
        });
    } else if (_action === 'remove_favourite') {
      result = await ofetch(
        `${API_BASE_URL}/campsites/${campsite_id}/favourites`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          parseResponse: JSON.parse
        })
        .then((res)=>{
          return res;
        })
        .catch((err) => {
          error = true;
          return err;
        });
    }
    console.log('result: ', result);

    if (error) {
      return json({ error: true, message: result }, { status: 200 });
    }
    return json({ success: true, message: result }, { status: 200 });
  }

  return json(
    { error: { message: 'Method Not Allowed' } },
    { status: 405 });
};

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
                  <ListingItem
                    key={data.id}
                    data={i}
                    index={index}
                  />
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

function ListingItem({ data, index }) {
  const fetcher = useFetcher();
  const { user } = useRouteLoaderData('root');
  const userData = user?.data;

  return (
    <div className="flex flex-col flex-none gap-2 relative">
      <Link to={`/campsites/${data.attributes.slug}`}>
        <img
          className="aspect-square w-full flex-none bg-gray-200 rounded-xl object-cover"
          src={`${data.attributes.cover_image}?lock=${index}`}
        />
        <div className="text-sm text-neutral-500">
          <p className="capitalize text-base text-black font-medium">
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
      <fetcher.Form method="POST">
        <input
          hidden
          type="hidden"
          name="campsite_id"
          value={data.id}
        />
        <button
          name="_action"
          value={data.attributes.favourites_users.includes(parseInt(userData?.id)) ? 'remove_favourite' : 'add_favourite'}
          className={`h-5 flex-none w-5 rounded-lg border ${
            data.attributes.favourites_users.includes(parseInt(userData?.id)) ?
              'bg-pink-400' :
              'bg-pink-200'
          } absolute right-3 top-3`}
        >
        </button>
      </fetcher.Form>}
    </div>

  );
}
