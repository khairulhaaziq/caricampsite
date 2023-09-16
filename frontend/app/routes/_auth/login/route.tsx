import { Link } from '@remix-run/react';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';

export default function Login() {
  return (
    <>
      <img src="logo.svg" className="h-16" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
      </div>
      <div className="flex flex-col gap-4">
        <FormTextField label="Email" />
        <FormTextField label="Password" type="password" />
        <FormButton label="Login" />
      </div>
      <p className="self-center text-neutral-500">
        Don't have an account yet?{' '}
        <Link className="text-[#0091E2]" to="/signup">Sign up</Link>
      </p>
    </>
  );
}
