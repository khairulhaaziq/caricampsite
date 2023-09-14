import {
  json,
  type LoaderArgs,
  type V2_MetaFunction
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const result = await fetch('http://localhost:3000/api/v1/campsites').then(async (res)=>{
    const json = await res.json();
    return json;
  });

  return json({ result });
};

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
