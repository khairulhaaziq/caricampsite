import { Link, Outlet } from '@remix-run/react';
import type { ReactNode } from 'react';

export default function AuthLayout() {
  return (
    <div className="flex sm:justify-center items-center sm:px-6 max-sm:pt-14 pb-20 h-screen sm:bg-neutral-100 flex-col">
      <Link to="/" className='absolute left-8 top-6'><p className="font-semibold text-xl">Home</p></Link>
      <Card>
        <Outlet />
      </Card>
    </div>
  );
}

function Card({ children }: {children?: ReactNode} = {}) {
  return (
    <div className="w-full max-w-[450px] rounded-3xl px-6 sm:px-8 py-8 bg-white flex flex-col gap-7">
      {children}
    </div>
  );
}
