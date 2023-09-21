import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { Auth } from '~/modules/auth/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // TODO: Need to fix this auth guard
  if (!await Auth.validateToken(request)) {
    return Auth.unauthorizedResponse(request);
  }

  return {};
};

export default function AccountSettings() {
  return (
    <div className="flex justify-center px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-4 pb-16">
      <div className="w-full max-w-4xl flex flex-col gap-16 py-12">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold">
            Account
          </h1>
          <p className="text-lg">Khairul Haaziq, test@example.com</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AccountSettingsCard to="personal-info">
            <div className="h-12 mb-4"></div>
            <h3 className="font-medium">Personal Info</h3>
            <p className="text-sm text-neutral-500">
              Provide personal details and how we can reach you
            </p>
          </AccountSettingsCard>
          <AccountSettingsCard to="personal-info">
            <div className="h-12 mb-4"></div>
            <h3 className="font-medium">Personal Info</h3>
            <p className="text-sm text-neutral-500">
              Provide personal details and how we can reach you
            </p>
          </AccountSettingsCard>
        </div>
      </div>
    </div>
  );
}

function AccountSettingsCard({ children, to }:
  React.LinkHTMLAttributes<HTMLAnchorElement> & { to: string}
){
  return (
    <Link
      to={to}
      className="border shadow-dropshadow/floating border-neutral-200 rounded-2xl p-5 space-y-4 hover:shadow-dropshadow/button transition-all"
    >
      {children}
    </Link>
  );
}
