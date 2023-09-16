import { Link } from '@remix-run/react';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';

export default function Signup() {
  return (
    <>
      <img src="logo.svg" className="h-16" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-neutral-500">
          Description. Fill in your username and password
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <FormTextField label="Email" />
        <FormTextField label="Password" type="password" />
        <FormTextField label="Confirm Password" type="password" />
        <FormButton label="Signup" />
      </div>
      <p className="self-center text-neutral-500">
        Already have an account?{' '}
        <Link className="text-[#0091E2]" to="/login">Log in</Link>
      </p>
    </>
  );
}
