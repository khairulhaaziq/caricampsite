import type { DataFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useActionData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';
import { Auth } from '~/modules/auth/auth.server';
import { commitSession, getSession } from '~/utils/sessions.server';

export const schema = z.object({
  email: zfd
    .text(z
      .string({ required_error: 'Please enter your email.' })
      .email({ message: 'Please enter a valid email address.' })),
  password: zfd
    .text(z
      .string({ required_error: 'Please enter a password.' })
      .min(6, { message: 'Password must be at least 6 characters.' }))
});

const validator = withZod(schema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const tokenValidated = await Auth.validateToken(request);

  if (tokenValidated) {
    return redirect('/');
  }

  return ({});
};

export const action = async ({ request }: DataFunctionArgs) => {
  switch (request.method) {
    case 'POST': {
      const result = await validator.validate(
        await request.formData()
      );
      if (result.error)
        return validationError(result.error, result.submittedData);
      const { email, password } = result.data;

      const user = await Auth.verifyLogin(email, password);

      if (!user) {
        return json({
          fieldErrors: { password: 'Invalid email or password' },
          repopulateFields: result.submittedData
        });
      }

      if (user.error) {
        return json({
          fieldErrors: { password: 'Server Error. Please try again.' },
          repopulateFields: result.submittedData
        });
      }

      // Stores auth token in session
      const session = await getSession(
        request.headers.get('Cookie')
      );
      session.set('token', user);

      return json({}, {
        headers: {
          'Set-Cookie': await commitSession(session),
        }
      });
    }
    default: {
      return json(
        { error: { message: 'Method Not Allowed' } },
        { status: 405 });
    }
  }
};

export default function Login() {
  const actionData = useActionData();

  return (
    <>
      <img src="logo.svg" className="h-16" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
      </div>
      <div className="flex flex-col gap-4">
        <ValidatedForm
          validator={validator}
          method="post"
          className="contents"
          defaultValues={{
            email: actionData?.repopulateFields?.email,
            password: actionData?.repopulateFields?.password,
          }}
        >
          <FormTextField name="email" label="Email" />
          <FormTextField
            name="password"
            label="Password"
            type="password"
          />
          <FormButton label="Login" />
        </ValidatedForm>
      </div>
      <p className="self-center text-neutral-500">
        Don't have an account yet?{' '}
        <Link className="text-[#0091E2]" to="/signup">Sign up</Link>
      </p>
    </>
  );
}
