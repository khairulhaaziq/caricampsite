import type { DataFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useSearchParams } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { ofetch } from 'ofetch';
import { type ReactNode, useMemo } from 'react';
import { ValidatedForm, validationError } from 'remix-validated-form';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';
import { ChoiceboxItem } from '~/components/ui/Choicebox';
import { API_BASE_URL } from '~/config.server';
import { Auth } from '~/modules/auth/auth.server';
import { commitSession, getSession } from '~/utils/sessions.server';

import { schema } from './schema';

const validator = withZod(schema);

const steps = [
  { index: 0, stepName: 'Details', component: (<FormDetails />) },
  { index: 1, stepName: 'Location', component: (<FormLocation />) },
  { index: 2, stepName: 'Features', component: (<FormFeatures />) },
  { index: 3, stepName: 'Images', component: (<FormImages />) },
  { index: 4, stepName: 'Contact', component: (<FormContacts />) },
  { index: 5, stepName: 'Additional Information', component: (<FormContacts />) }
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const tokenValidated = await Auth.validateToken(request);

  if (!tokenValidated) {
    return redirect('/login');
  }

  return ({});
};

export const action = async ({ request }: DataFunctionArgs) => {
  switch (request.method) {
    case 'POST': {
      const session = await getSession(
        request.headers.get('Cookie')
      );

      const token = session.get('token')?.token;

      let error = false;

      const formResult = await validator.validate(
        await request.formData()
      );

      if (formResult.error)
        return validationError(formResult.error, formResult.submittedData);

      console.log(formResult.data);

      const { name, description, images, cover_image } = formResult.data;

      const result = await ofetch(
        `${API_BASE_URL}/campsites`, {
          method: 'POST',
          body: { campsites: { name, description, images, cover_image } },
          headers: {
            'Authorization': `Bearer ${token}`
          },
          parseResponse: JSON.parse
        })
        .catch((err) => {
          error = true;
          console.log('error: ', err);

          return {
            __type: 'Error',
            error: true,
            message: err.data?.message,
            statusCode: err.data?.code,
          };
        });

      console.log('result: ', result);

      if (error) {
        session.flash(
          'error',
          'Failed to create a new campsite listing!'
        );

        return json({ result }, {
          headers: {
            'Set-Cookie': await commitSession(session),
          }
        });
      }

      session.flash(
        'globalMessage',
        'Successfully created a new campsite listing!'
      );

      console.log(result);

      return json({ result }, {
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

export default function CampsitesNew() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStep = useMemo(()=>{
    return searchParams.get('step') || 'details';
  }, [searchParams]);

  return (
    <div className="flex justify-center sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 min-h-screen pt-20 pb-24">
      <div className="w-full max-w-6xl flex flex-col items-center gap-5 relative">
        <FormStepper currentStep={currentStep} />
        <Card>
          {steps.find(i=>i.stepName.toLowerCase() === currentStep)?.component}
        </Card>
      </div>
    </div>
  );
}

function Card({ children }: {children?: ReactNode} = {}) {
  return (
    <div className="w-full max-w-[600px] rounded-3xl px-6 sm:px-8 py-8 bg-white flex flex-col gap-7">
      {children}
    </div>
  );
}

function FormStepper({ currentStep }: {currentStep: string}) {
  return (
    <div className="absolute left-6 top-8 max-md:hidden">
      <div className="flex flex-col gap-4 pb-6 overflow-x-scroll">
        {steps.map((i, index)=>(
          <Link to={`?step=${i.stepName.toLowerCase()}`} className="flex items-center gap-2">
            <div className={`h-6 w-6 flex-none ${ i.stepName.toLowerCase() === currentStep ? 'bg-blue-500' : 'bg-neutral-300' } text-white rounded-full flex items-center justify-center text-center`}>
              {index + 1}
            </div>
            <p className={`text-sm ${ i.stepName.toLowerCase() === currentStep ? '' : 'text-neutral-500' }`}>{i.stepName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FormDetails() {
  return (
    <div className="contents">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold">Basic Information</h1>
        <p className="text-neutral-500">Let's get you set up!</p>
      </div>
      <ValidatedForm
        validator={validator}
        className="contents"
        method="post"
      >
        <div className="flex flex-col gap-4">
          <FormTextField name="name" label="Name" />
          <FormTextField
            name="description"
            label="Description"
            textarea
          />
          <FormTextField
            name="images[0]"
            label="images[0]"
            defaultValue="https://loremflickr.com/300/300"
          />
          <FormTextField
            name="cover_image"
            label="cover_image"
            defaultValue="https://loremflickr.com/300/300"
          />

        </div>
        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Your campsite location</h1>
            <p className="text-neutral-500">Let's get you set up!</p>
          </div>
          <div className="flex flex-col gap-4">
            <FormTextField label="Address Line 1" />
            <FormTextField label="Address Line 2" />
            <FormTextField label="City" />
            <FormTextField label="State" />
            <FormTextField label="Country" />
          </div>
        </div>

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Your campsite location</h1>
            <p className="text-neutral-500">Let's get you set up!</p>
          </div>
          <div className="flex flex-col gap-4">
            <FormTextField label="Address Line 1" />
            <FormTextField label="Address Line 2" />
            <FormTextField label="City" />
            <FormTextField label="State" />
            <FormTextField label="Country" />
            <div className="flex gap-2 items-center">
              <ChoiceboxItem
                multiple
                label="Single payment"
                name="choiceboxcheckboxgroup"
                value="choiceboxcheck1"
                onCheckedChange={(val) => console.log(val)}
                description="One-time payment"
                className="mt-0.5"
              />
              <ChoiceboxItem
                multiple
                label="Single payment"
                name="choiceboxcheckboxgroup"
                value="choiceboxcheck1"
                description="One-time payment"
                className="mt-0.5"
              />
            </div>
          </div>
        </div>

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Your campsite location</h1>
            <p className="text-neutral-500">Let's get you set up!</p>
          </div>
          <div className="flex flex-col gap-4">
            <FormTextField label="Address Line 1" />
            <FormTextField label="Address Line 2" />
            <FormTextField label="City" />
            <FormTextField label="State" />
            <FormTextField label="Country" />
          </div>
        </div>

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Your campsite contacts</h1>
            <p className="text-neutral-500">Let's get you set up!</p>
          </div>
          <div className="flex flex-col gap-4">
            <FormTextField label="Name" />
            <FormTextField label="Mobile No." />

            <FormTextField label="Instagram" />
          </div>
        </div>

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Additional information</h1>
            <p className="text-neutral-500">Let's get you set up!</p>
          </div>
          <div className="flex flex-col gap-4">
            <FormTextField label="Description" />
            <FormTextField label="Things to know" />
            <FormTextField label="Direction instructions" />
          </div>
        </div>

        <div className="flex justify-between items-center fixed bottom-0 left-0 right-0 bg-white px-8 py-4 border-t border-neutral-300">
          <Link>Back</Link>
          <FormButton label="Continue" />
        </div>
      </ValidatedForm>
    </div>
  );
}

function FormLocation() {
  return (
    <div className="contents">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold">Basic Information</h1>
        <p className="text-neutral-500">Let's get you set up!</p>
      </div>
      <div className="flex flex-col gap-4">
        <FormTextField label="Address Line 1" />
        <FormTextField label="Address Line 2" />
        <FormTextField label="City" />
        <FormTextField label="State" />
        <FormTextField label="Country" />
      </div>
    </div>
  );
}

function FormFeatures() {
  return (
    <div className="contents">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold">Basic Information</h1>
        <p className="text-neutral-500">Let's get you set up!</p>
      </div>
      <div className="flex flex-col gap-4">
        <FormTextField label="Name" />
        <FormTextField label="Mobile No." />
      </div>
    </div>
  );
}

function FormImages() {
  return (
    <div className="contents">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold">Basic Information</h1>
        <p className="text-neutral-500">Let's get you set up!</p>
      </div>
      <div className="flex flex-col gap-4">
        <FormTextField label="Upload images here" />
      </div>
    </div>
  );
}

function FormContacts() {
  return (
    <div className="contents">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold">Basic Information</h1>
        <p className="text-neutral-500">Let's get you set up!</p>
      </div>
      <div className="flex flex-col gap-4">
        <FormTextField label="Name" />
        <FormTextField label="Mobile No." />
      </div>
    </div>
  );
}


