import { Link } from '@remix-run/react';
import { type ReactNode, useMemo } from 'react';

export default function WithTopbar({ children }: {children?: ReactNode}) {
  return (
    <>
      <Topbar />
      {children}
    </>
  );
}

function Topbar() {
  const memoedTopbar = useMemo(()=>(
    <div className="h-20 border-b border-neutral-200">
      <div className="flex justify-center px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 h-full">
        <div className="max-w-6xl w-full flex items-center justify-between">
          <Link to="/">
            <img src="/logo.svg" className="h-10" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/campsites/new">
              <div className="font-semibold bg-neutral-200 rounded-md h-10 px-3 flex items-center justify-center">
                Add a campsite
              </div>
            </Link>
            <Link to="/login">
              <div className="font-semibold bg-neutral-200 rounded-md h-10 px-3 flex items-center justify-center">
                Login
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  ), []);
  return memoedTopbar;
}
