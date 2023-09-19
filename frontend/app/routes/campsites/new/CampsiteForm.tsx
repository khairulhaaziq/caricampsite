import { Link } from '@remix-run/react';
import { type ReactNode } from 'react';
import {
  useField,
  useFormContext,
  ValidatedForm
} from 'remix-validated-form';
import type { z } from 'zod';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';
import { ChoiceboxItem } from '~/components/ui/Choicebox';

import ImageDropzone from './ImageDropzone';
import type { schema } from './schema';
import { validator } from './schema';
import {
  AccessibilityFeatureOption,
  ActivityOption,
  AmenityOption,
  CategoryOption,
  FeatureOption
} from './types';

interface CampsiteFormProps {
  formDefaultValues?: z.infer<typeof schema>;
  action?: string;
}

export default function CampsiteForm({ formDefaultValues, action }: CampsiteFormProps) {
  const formId = 'form-details';
  const { validate, getValues, ...formContext  } = useFormContext(formId);
  const { error: imageFieldError, validate: imageFieldValidate } = useField('images', { formId });
  const { error: featureFieldError, validate: featureFieldValidate } = useField('features', { formId });
  const { error: amenityFieldError, validate: amenityFieldValidate } = useField('amenities', { formId });
  const { error: categoryFieldError, validate: categoryFieldValidate } = useField('categories', { formId });
  const { error: activityFieldError, validate: activityFieldValidate } = useField('activities', { formId });
  const { error: accessibilityFeatureFieldError, validate: accessibilityFeatureFieldValidate } = useField('accessibility_features', { formId });

  return (
    <div className="flex justify-center sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 min-h-screen pt-16 pb-24">
      <div className="w-full max-w-6xl flex flex-col items-center gap-5 relative">
        <Card>
          <div className="contents">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-2xl font-bold">Basic Information</h1>
              <p className="text-neutral-500">Let's get you set up!</p>
            </div>
            <ValidatedForm
              action={action}
              id={formId}
              validator={validator}
              defaultValues={formDefaultValues}
              className="contents"
              method="POST"
            >
              <div className="flex flex-col gap-4">
                <FormTextField name="title" label="Title" />
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
                <ImageDropzone validate={imageFieldValidate} defaultFileUrls={formDefaultValues?.images} />
              </div>


              <div className="contents">
                <div className="flex flex-col gap-0.5 mt-6">
                  <h1 className="text-2xl font-bold">Your campsite location</h1>
                  <p className="text-neutral-500">Let's get you set up!</p>
                </div>
                <div className="flex flex-col gap-4">
                  <FormTextField name="campsite_address_attributes.addressLine1" label="Address Line 1" />
                  <FormTextField name="campsite_address_attributes.addressLine2" label="Address Line 2" />
                  <FormTextField name="campsite_address_attributes.city" label="City" />
                  <FormTextField name="campsite_address_attributes.postcode" label="Postcode" />
                  <FormTextField name="campsite_address_attributes.state" label="State" />
                  <FormTextField name="campsite_address_attributes.country" label="Country" />
                </div>
              </div>

              <div className="contents">
                <div className="flex flex-col gap-0.5 mt-6">
                  <h1 className="text-2xl font-bold">Your campsite location</h1>
                  <p className="text-neutral-500">Let's get you set up!</p>
                </div>
                <div className="flex flex-col gap-4">
                  <FormTextField
                    name="campsite_fee_attributes.currency"
                    label="Currency"
                    defaultValue="MYR"
                  />
                  <FormTextField name="campsite_fee_attributes.from" label="From" />
                  <FormTextField name="campsite_fee_attributes.to" label="To" />
                </div>
              </div>

              <div className="contents">
                <div className="flex flex-col gap-0.5 mt-6">
                  <h1 className="text-2xl font-bold">Your campsite location</h1>
                  <p className="text-neutral-500">Let's get you set up!</p>
                </div>
                <div className="flex flex-col gap-4">
                  <FormTextField name="campsite_location_attributes.latitude" label="Latitude" />
                  <FormTextField name="campsite_location_attributes.longitude" label="Longitude" />
                </div>
              </div>

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
                        defaultChecked={formDefaultValues?.feature_option_ids?.includes(featureOption.id)}
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
                        defaultChecked={formDefaultValues?.amenity_option_ids?.includes(amenityOption.id)}
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
                        defaultChecked={formDefaultValues?.category_option_ids?.includes(categoryOption.id)}
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
                        defaultChecked={formDefaultValues?.activity_option_ids.includes(activityOption.id)}
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
                        defaultChecked={formDefaultValues?.accessibility_feature_option_ids.includes(accessibilityFeatureOption.id)}
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
                  <FormTextField name="contact_name1" label="Name" />
                  <FormTextField name="contact_mobile1" label="Mobile No." />

                  <FormTextField name="instagram" label="Instagram" />
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
