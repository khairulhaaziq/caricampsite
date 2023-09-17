import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, LoaderFunctionArgs  } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

import styles from '~/tailwind.css';

import { commitSession, getSession } from './utils/sessions.server';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export const loader = async ({ request, }: LoaderFunctionArgs) => {
  const session = await getSession(
    request.headers.get('Cookie')
  );
  const message = session.get('globalMessage') || null;
  const toastErrorMessage = session.get('error') || null;

  return json(
    { message, toastErrorMessage },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};

export default function App() {
  const { message, toastErrorMessage } = useLoaderData();

  useEffect(()=>{
    if (toastErrorMessage) {
      toast.custom((t) => (
        <div className="flex items-center justify-center w-[356px]">
          <div className="rounded-full h-12 px-5 bg-red-500 text-white items-center flex">
            {toastErrorMessage} <button className='pl-4 pr-2' onClick={() => toast.dismiss(t)}>X</button>
          </div>
        </div>
      ));
      console.log('toasterrormessage: ', toastErrorMessage);
      return;
    }
    if (message) {
      toast.custom((t) => (
        <div className="flex items-center justify-center w-[356px]">
          <div className="rounded-full h-12 px-5 bg-[#31B5FF] text-white items-center flex">
            {message} <button className='pl-4 pr-2' onClick={() => toast.dismiss(t)}>X</button>
          </div>
        </div>
      ));
      console.log('toastmessage: ', message);
    }
  }, [message]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* custom font using google font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* end */}
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
