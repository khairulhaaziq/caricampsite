import {
  Form,
  Link,
  useRouteLoaderData
} from '@remix-run/react';
import { type ReactNode } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import SearchInput from '~/routes/SearchInput';

export default function WithTopbar({ children, path='root' }: {children?: ReactNode; path?: string}) {
  const { user } = useRouteLoaderData('root');

  return (
    <>
      {children}
      <div className="h-16 border-b border-neutral-200 fixed top-0 left-0 right-0 bg-white text-sm">
        <div className="flex justify-center px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 h-full">
          <div className="max-w-6xl w-full grid items-center grid-cols-4">
            <div>
              <Link to="/">
                <img src="/logo.svg" className="h-10" />
              </Link>
            </div>
            <div className="col-span-2 flex justify-center">
              {path == 'root' && <SearchInput /> }
            </div>
            <div className="flex items-center gap-2 justify-end">
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
                (
                  <>
                    <Form action="/logout" method="POST">
                      <button className="font-medium active:scale-90 border border-neutral-300 rounded-xl h-10 px-3 flex items-center justify-center">
                        Logout
                      </button>
                    </Form>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <div className="font-medium border border-neutral-300 rounded-full h-10 w-10 aspect-square flex items-center justify-center">
                          KH
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Favourites</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/listings">
                            Manage Listings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/account-settings">
                            Account
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
