import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect } from 'react';

import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table';
import { getInternalData } from '~/utils/loader';

dayjs.extend(relativeTime);

export const loader = getInternalData({ path: '/listings' });

export default function AccountSettings() {
  const loaderData = useLoaderData();

  useEffect(()=>{
    if (loaderData)
      console.log('listings data: ', loaderData);
  }, []);

  return (
    <div className="flex justify-center px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-4 pb-16">
      <div className="w-full max-w-6xl flex flex-col gap-16 py-12">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold">
            Listings
          </h1>
        </div>

        <UserListingsTable data={loaderData?.data} />

        <Pagination pagination={loaderData?.meta?.pagination} />
      </div>
    </div>
  );
}

function UserListingsTable({ data }) {
  const columnDef = [
    {
      key: 'action',
      header: <div>Header</div>,
      cell: ({ row })=>(
        <Checkbox
          aria-label="Select row"
        />
      )
    },
    {
      key: 'title',
      header: <div>Header</div>,
      cell: ({ row })=>(
        <div className="capitalize flex items-center gap-4">
          <img className="h-14 aspect-[3/2] rounded-xl" src={row?.cover_image} />
          {row?.title}
        </div>
      )
    },
    {
      key: 'slug',
      header: <div>Header</div>,
      cell: ({ row })=><div>{row?.slug}</div>
    },
    {
      key: 'created_at',
      header: <div>Header</div>,
      cell: ({ row })=>{
        const parsedTimestamp = dayjs(row?.created_at);
        const timeDifference = dayjs().to(parsedTimestamp);
        return (
          <div className="text-right font-medium">{timeDifference}</div>
        );}
    },
    {
      key: 'actions',
      cell: ({ row })=>(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>),
    },
  ];

  const parsedData = data.map(i=>i.attributes);

  return (
    <div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {columnDef.map(i=>
              <TableHead>
                Hello
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <tbody>
          {parsedData.map((row)=>
            <TableRow>
              {columnDef.map(column=>
                <TableCell>
                  {column.cell({ row }) || 'Hello'}
                </TableCell>
              )}
            </TableRow>
          )}
        </tbody>
      </Table>
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
