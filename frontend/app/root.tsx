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

import fontStyles from '~/font.css';
import styles from '~/tailwind.css';

import { User } from './modules/user/user.server';
import { commitSession, getSession } from './utils/sessions.server';

export const links: LinksFunction = () => [
  { rel: 'preload', href: '/fonts/plusjakarta-latin.woff2', as: 'font' },
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: fontStyles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  {
    rel: 'stylesheet',
    href: 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css'
  }
];

export const loader = async ({ request, }: LoaderFunctionArgs) => {
  const session = await getSession(
    request.headers.get('Cookie')
  );
  const message = session.get('globalMessage') || null;
  const toastErrorMessage = session.get('error') || null;

  const user = await User.getUser(request);

  return json(
    { message, toastErrorMessage, user },
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
          <div className="rounded-full h-12 px-5 bg-red-500 text-white items-center flex text-center">
            {toastErrorMessage} <button className="pl-4 pr-2" onClick={() => toast.dismiss(t)}>X</button>
          </div>
        </div>
      ));
      console.log('toasterrormessage: ', toastErrorMessage);
      return;
    }
    if (message) {
      toast.custom((t) => (
        <div className="flex items-center justify-center w-[356px]">
          <div className="rounded-full h-12 px-5 bg-[#31B5FF] text-white items-center flex text-center">
            {message} <button className="pl-4 pr-2" onClick={() => toast.dismiss(t)}>X</button>
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
