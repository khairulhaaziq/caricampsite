import { Link, useLoaderData } from '@remix-run/react';

import { getInternalData } from '~/utils/loader';

export const loader = getInternalData({ path: '/account_settings/personal_info' });

export default function PersonalInfoPage() {
  const loaderData = useLoaderData();
  const name = loaderData;

  return (
    <div className="flex justify-center px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-4 pb-16">
      <div className="w-full max-w-4xl flex flex-col gap-16 py-12">
        <div className="space-y-3">
          <p className="font-medium text-sm"><Link to="/account-settings" className="hover:underline underline-offset-1">Account</Link><span className="mx-4 text-neutral-500 font-normal">&gt;</span>Personal Info</p>
          <h1 className="text-3xl font-semibold">
            Personal Info
          </h1>
        </div>

        <div className="">
          <ListItem
            label="Legal name"
            value={(loaderData?.first_name) + (loaderData?.last_name ? ` ${loaderData.last_name}` : '')}
          />
          <ListItem label="Email" value={loaderData.email || 'Not defined'} />
          <ListItem label="Phone Number" value={loaderData.phone_number || 'Not defined'} />
          <ListItem label="Legal name" value="Khairul Haaziq" />
        </div>

        {JSON.stringify(loaderData)}
      </div>
    </div>
  );
}

function ListItem({ label, value, onEditClick }: {label: string; value: string; onEditClick?: ()=>void}) {
  return (
    <li className="border-b flex py-5">
      <div className="space-y-1 flex-grow">
        <h4>{label}</h4>
        <p className="text-[15px] text-neutral-500">{value}</p>
      </div>
      <div>
        <button
          className="font-medium underline text-[15px]"
          onClick={()=>onEditClick && onEditClick()}
        >
          Edit
        </button>
      </div>
    </li>
  );
}
