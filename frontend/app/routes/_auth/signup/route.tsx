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
      .min(6, { message: 'Password must be at least 6 characters.' })),
  confirm_password: zfd
    .text(z
      .string({ required_error: 'Please enter a password.' })
      .min(6, { message: 'Password must be at least 6 characters.' }))
}).refine((data) => data.password === data.confirm_password, {
  message: 'Password don\'t match',
  path: ['confirm_password'],
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
      const session = await getSession(
        request.headers.get('Cookie')
      );

      const result = await validator.validate(
        await request.formData()
      );

      if (result.error)
        return validationError(result.error, result.submittedData);

      const { email, password } = result.data;

      const user = await Auth.register(email, password);

      if (!user || user.error) {
        session.flash(
          'error',
          'Failed to register!'
        );

        return json({
          fieldErrors: { password: 'Invalid email or password' },
          repopulateFields: result.submittedData
        }, {
          headers: {
            'Set-Cookie': await commitSession(session),
          }
        });
      }

      session.set('token', user);

      session.flash(
        'globalMessage',
        'Successfully logged in!'
      );

      return redirect('/', {
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

export default function Signup() {
  const actionData: any = useActionData();

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
        <ValidatedForm
          validator={validator}
          method="post"
          className="contents"
          defaultValues={{
            email: actionData?.repopulateFields?.email,
            password: actionData?.repopulateFields?.password,
            confirm_password: actionData?.repopulateFields?.confirm_password,
          }}
        >
          <FormTextField name="email" label="Email" />
          <FormTextField
            name="password"
            label="Password"
            type="password"
          />
          <FormTextField
            name="confirm_password"
            label="Confirm Password"
            type="password"
          />
          <FormButton label="Signup" />
        </ValidatedForm>
      </div>
      <p className="self-center text-neutral-500">
        Already have an account?{' '}
        <Link className="text-[#0091E2]" to="/login">Log in</Link>
      </p>
    </>
  );
}
