import { Outlet } from '@remix-run/react';

import WithTopbar from '~/components/layouts/WithTopbar';

export default function Layout() {
  return (
    <WithTopbar path="/campsites/">
      <div className="pt-16">
        <Outlet />
      </div>
    </WithTopbar>
  );
}
