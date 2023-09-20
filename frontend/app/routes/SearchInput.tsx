import {
  Form,
  useLoaderData,
  useSubmit
} from '@remix-run/react';
import {
  useEffect,
  useMemo,
  useState
} from 'react';
import { useDebounce } from 'usehooks-ts';

import IconSearch from '~/components/icons/IconSearch';

export default function SearchInput(){
  const { params } = useLoaderData();
  const searchParams = useMemo(()=>new URLSearchParams(params), [params]);
  const submit = useSubmit();

  const [query, setQuery] = useState(searchParams.get('merchant_name'));
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchParams.set('q', debouncedQuery);
    } else {
      searchParams.delete('q');
    }
    submit(searchParams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <Form className="contents">
      <div className="relative w-full rounded-full overflow-hidden border border-neutral-200 hover:border-neutral-400 focus-within:border-neutral-400 transition-all w-full max-w-[360px]">
        <input
          className="outline-none ring-0 text-sm h-11 pr-3 pl-[38px] w-full transition-all"
          placeholder="Search merchant name"
          name="query"
          type="search"
          value={query ? query : undefined}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <span className="absolute left-4 top-0 h-full flex items-centertext-dim">
          <span className="w-3.5 h-3.5">
            <IconSearch />
          </span>
        </span>
      </div>
    </Form>
  );
}
