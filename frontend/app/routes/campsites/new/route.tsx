import type { DataFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { ofetch } from 'ofetch';
import { type ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  useField,
  useFormContext,
  ValidatedForm,
  validationError
} from 'remix-validated-form';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';
import { ChoiceboxItem } from '~/components/ui/Choicebox';
import { API_BASE_URL } from '~/config.server';
import { Auth } from '~/modules/auth/auth.server';
import { commitSession, getSession } from '~/utils/sessions.server';

import { schema } from './schema';
import {
  AccessibilityFeatureOption,
  ActivityOption,
  AmenityOption,
  CategoryOption,
  FeatureOption
} from './types';

const validator = withZod(schema);

// const steps = [
//   { index: 0, stepName: 'Details', component: (<FormDetails />) },
//   { index: 1, stepName: 'Location', component: (<FormLocation />) },
//   { index: 2, stepName: 'Features', component: (<FormFeatures />) },
//   { index: 3, stepName: 'Images', component: (<FormImages />) },
//   { index: 4, stepName: 'Contact', component: (<FormContacts />) },
//   { index: 5, stepName: 'Additional Information', component: (<FormContacts />) }
// ];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // const tokenValidated = await Auth.validateToken(request);

  // if (!tokenValidated) {
  //   return redirect('/login');
  // }

  return ({});
};

export const action = async ({ request }: DataFunctionArgs) => {
  switch (request.method) {
    case 'POST': {
      const session = await getSession(
        request.headers.get('Cookie')
      );

      const tokenValidated = await Auth.validateToken(request);

      if (!tokenValidated) {
        session.flash(
          'error',
          'You need to be logged in to create a listing!'
        );

        return json({ message: 'Unauthorized' }, {
          status: 401,
          headers: {
            'Set-Cookie': await commitSession(session),
          }
        });
      }

      const token = session.get('token')?.token;

      let error = false;

      const formResult = await validator.validate(
        await request.formData()
      );

      if (formResult.error)
        return validationError(formResult.error, formResult.submittedData);

      console.log(formResult.data);

      const { ...formData } = formResult.data;

      const result = await ofetch(
        `${API_BASE_URL}/campsites`, {
          method: 'POST',
          body: { campsites: formData },
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
  // const [searchParams, setSearchParams] = useSearchParams();

  // const currentStep = useMemo(()=>{
  //   return searchParams.get('step') || 'details';
  // }, [searchParams]);

  return (
    <div className="flex justify-center sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 min-h-screen pt-20 pb-24">
      <div className="w-full max-w-6xl flex flex-col items-center gap-5 relative">
        <Card>
          <FormDetails />
          {/*steps.find(i=>i.stepName.toLowerCase() === currentStep)?.component*/}
        </Card>
      </div>
    </div>
  );
}

function Card({ children }: {children?: ReactNode} = {}) {
  return (
    <div className="w-full max-w-[1000px] rounded-3xl px-6 sm:px-8 py-8 bg-white flex flex-col gap-7">
      {children}
    </div>
  );
}

// function FormStepper({ currentStep }: {currentStep: string}) {
//   return (
//     <div className="absolute left-6 top-8 max-md:hidden">
//       <div className="flex flex-col gap-4 pb-6 overflow-x-scroll">
//         {steps.map((i, index)=>(
//           <Link to={`?step=${i.stepName.toLowerCase()}`} className="flex items-center gap-2">
//             <div className={`h-6 w-6 flex-none ${ i.stepName.toLowerCase() === currentStep ? 'bg-blue-500' : 'bg-neutral-300' } text-white rounded-full flex items-center justify-center text-center`}>
//               {index + 1}
//             </div>
//             <p className={`text-sm ${ i.stepName.toLowerCase() === currentStep ? '' : 'text-neutral-500' }`}>{i.stepName}</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

function FormDetails() {
  const formId = 'form-details';
  const { validate, getValues, ...formContext  } = useFormContext(formId);
  const { error: imageFieldError, validate: imageFieldValidate } = useField('images', { formId });
  const { error: featureFieldError, validate: featureFieldValidate } = useField('features', { formId });
  const { error: amenityFieldError, validate: amenityFieldValidate } = useField('amenities', { formId });
  const { error: categoryFieldError, validate: categoryFieldValidate } = useField('categories', { formId });
  const { error: activityFieldError, validate: activityFieldValidate } = useField('activities', { formId });
  const { error: accessibilityFeatureFieldError, validate: accessibilityFeatureFieldValidate } = useField('accessibility_features', { formId });

  return (
    <div className="contents">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold">Basic Information</h1>
        <p className="text-neutral-500">Let's get you set up!</p>
      </div>
      <ValidatedForm
        id={formId}
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

        </div>

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Images</h1>
            <p className="text-neutral-500">Upload your best images</p>
            {imageFieldError && (
              <p className="text-danger flex gap-1 items-center">
                {imageFieldError}
              </p>
            )}
          </div>
          <ImageDropzone validate={imageFieldValidate} />
        </div>


        {/*<div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Your campsite location</h1>
            <p className="text-neutral-500">Let's get you set up!</p>
          </div>
          <div className="flex flex-col gap-4">
            <FormTextField name="addressLine1" label="Address Line 1" />
            <FormTextField name="addressLine2" label="Address Line 2" />
            <FormTextField name="city" label="City" />
            <FormTextField name="postcode" label="Postcode" />
            <FormTextField name="state" label="State" />
            <FormTextField name="country" label="Country" />
          </div>
        </div>*/}

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Features</h1>
            <p className="text-neutral-500">Select your campsite features</p>
            {featureFieldError && (
              <p className="text-danger flex gap-1 items-center">
                {featureFieldError}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
            {FeatureOption.map(featureOption=>{
              return (
                <ChoiceboxItem
                  key={featureOption.id}
                  multiple
                  label={featureOption.name}
                  name="feature_option_ids"
                  value={featureOption.id}
                  onCheckedChange={() => featureFieldValidate()}
                />
              );
            })}
          </div>
        </div>

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Amenities</h1>
            <p className="text-neutral-500">Select your campsite amenities</p>
            {amenityFieldError && (
              <p className="text-danger flex gap-1 items-center">
                {amenityFieldError}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
            {AmenityOption.map(amenityOption=>{
              return (
                <ChoiceboxItem
                  key={amenityOption.id}
                  multiple
                  label={amenityOption.name}
                  name="amenity_option_ids"
                  value={amenityOption.id}
                  onCheckedChange={() => amenityFieldValidate()}
                />
              );
            })}
          </div>
        </div>

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-neutral-500">Select your campsite categories</p>
            {categoryFieldError && (
              <p className="text-danger flex gap-1 items-center">
                {categoryFieldError}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
            {CategoryOption.map(categoryOption=>{
              return (
                <ChoiceboxItem
                  key={categoryOption.id}
                  multiple
                  label={categoryOption.name}
                  name="category_option_ids"
                  value={categoryOption.id}
                  onCheckedChange={() => categoryFieldValidate()}
                />
              );
            })}
          </div>
        </div>

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Activities</h1>
            <p className="text-neutral-500">Select your campsite activities</p>
            {activityFieldError && (
              <p className="text-danger flex gap-1 items-center">
                {activityFieldError}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
            {ActivityOption.map((activityOption)=>{
              return (
                <ChoiceboxItem
                  key={activityOption.id}
                  multiple
                  label={activityOption.name}
                  name="activity_option_ids"
                  value={activityOption.id}
                  onCheckedChange={() => activityFieldValidate()}
                />
              );
            })}
          </div>
        </div>

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Accessibility Features</h1>
            <p className="text-neutral-500">
              Select your campsite accessibility features
            </p>
            {accessibilityFeatureFieldError && (
              <p className="text-danger flex gap-1 items-center">
                {accessibilityFeatureFieldError}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
            {AccessibilityFeatureOption.map((accessibilityFeatureOption)=>{
              return (
                <ChoiceboxItem
                  key={accessibilityFeatureOption.id}
                  multiple
                  label={accessibilityFeatureOption.name}
                  name="accessibility_feature_option_ids"
                  value={accessibilityFeatureOption.id}
                  onCheckedChange={() => accessibilityFeatureFieldValidate()}
                />
              );
            })}
          </div>
        </div>

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Your campsite contacts</h1>
            <p className="text-neutral-500">Let's get you set up!</p>
          </div>
          <div className="flex flex-col gap-4">
            <FormTextField name="contacts[0].name" label="Name" />
            <FormTextField name="contacts[0].mobileNo" label="Mobile No." />

            <FormTextField name="social_links[0].instagram" label="Instagram" />
          </div>
        </div>

        <div className="contents">
          <div className="flex flex-col gap-0.5 mt-6">
            <h1 className="text-2xl font-bold">Additional information</h1>
            <p className="text-neutral-500">Let's get you set up!</p>
          </div>
          <div className="flex flex-col gap-4">
            <FormTextField name="notes" label="Notes" />
            <FormTextField name="direction_instructions" label="Direction instructions" />
          </div>
        </div>

        <div
          className="flex justify-between items-center fixed bottom-0 left-0 right-0 bg-white px-8 py-4 border-t border-neutral-300"
        >
          <Link>Back</Link>
          <button
            type="button"
            onClick={()=>{
              const formValues = Object.fromEntries(getValues());
              console.log(formContext);
              console.log(formValues);
            }}
          >Test button</button>
          <FormButton label="Continue" />
        </div>
      </ValidatedForm>
    </div>
  );
}

function ImageDropzone({ validate }: {validate: ()=>void}) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const form = new FormData();

    for (const file of acceptedFiles){
      const modifiedFileName = new Date().toISOString() + '_' + file.name;

      const modifiedFile = new File([file], modifiedFileName, {
        type: file.type,
      });

      form.append('image', modifiedFile);
    }

    await uploadFiles(form);
    validate();
  }, []);

  async function uploadFiles(form: FormData) {
    setIsLoading(true);
    let error = false;

    const result = await fetch('new/images',
      {
        method: 'POST',
        body: form,
      })
      .then(async (res) => {
        const json = await res.json();
        console.log(json);
        return json;
      })
      .catch((err) =>{
        error = true;
        console.error(err);
        return err;
      });

    if (!error) {
      result.result.fileUrls.forEach(fileUrl=>{
        setFiles((prevFiles) => [...prevFiles, { preview: fileUrl }]);
      });
    }

    setIsLoading(false);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const thumbs = files.map((file, index) => (
    <div key={index} className="relative">
      <img
        src={file.preview}
        className="aspect-square object-cover rounded-lg"
        // Revoke data uri after image is loaded
        onLoad={() => { URL.revokeObjectURL(file.preview); }}
      />
      <input
        type="hidden"
        hidden
        name={`images[${index}]`}
        value={file.preview}
      />
      <p className="absolute bottom-2 left-2">{file.fileName}</p>
    </div>
  ));

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {thumbs}
        {isLoading && (
          <div className="border-dashed border-2 border-neutral-200 bg-neutral-50 rounded-lg aspect-square flex-none items-center justify-center">
            'Uploading your image'
          </div>
        )}
        {files.length < 5 ? (
          <>
            {Array.from({ length: 5 - files.length }, (_, i) => i + 1).map((i)=>(
              <div
                key={i}
                className="border-dashed border-2 border-neutral-200 bg-neutral-50 rounded-lg aspect-square flex-none"
              >
                <div
                  {...getRootProps()}
                  className="flex items-center justify-center text-center h-full px-4"
                >
                  <input {...getInputProps()} />
                  {
                    isDragActive ?
                      <p>Drop the files here ...</p> :
                      <p className="text-neutral-600">Add a photo</p>
                  }
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="border-dashed border-2 border-neutral-200 bg-neutral-50 rounded-lg aspect-square flex-none">
            <div
              {...getRootProps()}
              className="flex items-center justify-center text-center h-full px-4"
            >
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop the files here ...</p> :
                  <p className="text-neutral-600">Add a photo</p>
              }
            </div>
          </div>
        )}
        <input
          type="hidden"
          hidden
          name="cover_image"
          value={files[0]?.preview}
          defaultValue="https://loremflickr.com/300/300"
        />
      </div>
    </>
  );
}
