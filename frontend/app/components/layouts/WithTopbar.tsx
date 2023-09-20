import {
  Form,
  Link,
  useRouteLoaderData
} from '@remix-run/react';
import { type ReactNode, useMemo } from 'react';

export default function WithTopbar({ children }: {children?: ReactNode}) {
  return (
    <>
      {children}
      <Topbar />
    </>
  );
}

function Topbar() {
  const { user } = useRouteLoaderData('root');

  const memoedTopbar = useMemo(()=>(
    <div className="h-[60px] border-b border-neutral-200 fixed top-0 left-0 right-0 bg-white text-sm">
      <div className="flex justify-center px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 h-full">
        <div className="max-w-6xl w-full flex items-center justify-between">
          <Link to="/">
            <img src="/logo.svg" className="h-10" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/campsites/new">
              <div className="font-medium active:scale-90 border border-neutral-300 rounded-xl h-10 px-3 flex items-center justify-center">
                Add a campsite
              </div>
            </Link>
            {!user
              ?
              (<Link to="/login">
                <div className="font-medium active:scale-90 border border-neutral-300 rounded-xl h-10 px-3 flex items-center justify-center">
                  Login
                </div>
              </Link>)
              :
              (<Form action="/logout" method="POST">
                <button className="font-medium active:scale-90 border border-neutral-300 rounded-xl h-10 px-3 flex items-center justify-center">
                  Logout
                </button>
              </Form>)
            }
          </div>
        </div>
      </div>
    </div>
  ), []);
  return memoedTopbar;
}
