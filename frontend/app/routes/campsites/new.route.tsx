import { Link, useSearchParams } from '@remix-run/react';
import { type ReactNode, useMemo } from 'react';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';
import { ChoiceboxItem } from '~/components/ui/Choicebox';

const steps = [
  { index: 0, stepName: 'Details', component: (<FormDetails />) },
  { index: 1, stepName: 'Location', component: (<FormLocation />) },
  { index: 2, stepName: 'Features', component: (<FormFeatures />) },
  { index: 3, stepName: 'Images', component: (<FormImages />) },
  { index: 4, stepName: 'Contact', component: (<FormContacts />) },
  { index: 5, stepName: 'Additional Information', component: (<FormContacts />) }
];

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
      <div className="flex justify-between items-center fixed bottom-0 left-0 right-0 bg-white px-8 py-4 border-t border-neutral-300">
        <Link>Back</Link>
        <FormButton label="Continue" />
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
      <div className="flex flex-col gap-4">
        <FormTextField label="Name" />
        <FormTextField label="Description" textarea />
        <FormTextField label="Category" />
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


