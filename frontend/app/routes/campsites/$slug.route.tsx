import { type DataFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ofetch } from 'ofetch';
import { useState } from 'react';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';
import IconStar from '~/components/icons/IconStar';
import { API_BASE_URL } from '~/config.server';
import { Auth } from '~/modules/auth/auth.server';
import { cn } from '~/utils/cn';
import { getApiData } from '~/utils/loader';

dayjs.extend(relativeTime);

export const schema = z.object({
  rating: zfd
    .numeric(z
      .number({ required_error: 'Rating is required.' })
      .min(1, { message: 'Rating is required' })
      .max(5, { message: 'Max rating is 5' })),
  body: zfd
    .text(z
      .string({ required_error: 'Content is required.' })
      .min(3, { message: 'Body must be more than 3 characters' })),
  campsite_id: zfd
    .numeric(z
      .number({ required_error: 'Campsite id is required.' })),
  _action: zfd
    .text(z
      .string({ required_error: '_action is required.' }))
});

const validator = withZod(schema);

export const loader = getApiData();

export const action = async ({ request }: DataFunctionArgs) => {
  const tokenValidated = await Auth.validateToken(request);

  if (!tokenValidated) {
    return Auth.unauthorizedResponse(request);
  }

  const result = await validator.validate(
    await request.formData()
  );

  if (result.error)
    return validationError(result.error, result.submittedData);

  const { _action, campsite_id, ...body } = result.data;

  if (_action === 'create_review') {

    let error = false;

    const authToken = await Auth.getToken(request);

    const result = await ofetch(
      `${API_BASE_URL}/campsites/${campsite_id}/reviews`, {
        method: 'POST',
        body,
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        parseResponse: JSON.parse
      })
      .then((res)=>{
        return res;
      })
      .catch((err) => {
        error = true;
        return err;
      });
    if (error) {
      return json({ error: true, message: result }, { status: 500 });
    }
    return json({ success: true, message: result }, { status: 200 });
  }

  return json(
    { error: { message: 'Method Not Allowed' } },
    { status: 405 });
};

export default function CampsiteSlug() {
  const { user } = useRouteLoaderData('root');
  const { data } = useLoaderData();
  const { attributes } = data;

  return (
    <div className="flex justify-center px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-20 pb-16">
      <div className="w-full max-w-6xl flex flex-col gap-5">
        <Header title={attributes.title} />
        <ImageGrid images={attributes.images} />

        <div className="flex gap-6 py-8">
          <MainSectionLayout className="flex-grow overflow-clip">

            <DescriptionSection
              description={attributes.description}
              className="border-t-0"
            />

            <FeaturesSection featureList={attributes.feature_options} />

            <ActivitiesSection activityList={attributes.activity_options} />

            <AmenitiesSection amenityList={attributes.amenity_options} />

            <AccessibilityFeaturesSection accessibilityFeatureList={attributes.accessibility_feature_options} />

            {attributes && (
              <div>{JSON.stringify(attributes)}</div>
            )}
          </MainSectionLayout>
          <div className="pr-3 w-[400px] flex-none">
            <div className="border rounded-xl p-6 flex flex-col gap-3">
              <h3 className="text-xl font-semibold">Reviews</h3>
              {!user && (<div>Log in to add a review!</div>)}
              {user && !attributes.reviews_users.includes(parseInt(user?.data?.id)) &&
                <ReviewInputField campsite_id={attributes.id} />}

              <ReviewsList reviews={attributes.reviews} />

              <p>{JSON.stringify(attributes.reviews)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div className="flex justify-between pt-8">
      <div className="text-neutral-500">
        <h1 className="font-bold text-2xl sm:text-3xl capitalize text-black">
          {title}
        </h1>
        <p>Category, Category</p>
        <p>Price, Price</p>
      </div>

      <div>
        <p>Favourite</p>
        <p>Share</p>
      </div>

    </div>
  );
}

function ImageGrid({ images, cover_image }: {images: string[]; cover_image?: string }) {
  return (
    <>
      <div className="hidden md:grid md:grid-cols-8 gap-3">
        <img
          className="w-full aspect-[11/10] bg-gray-200 rounded-xl flex-none col-span-4 row-span-2 object-cover"
          src={cover_image ||
            images[0] ||
            `https://loremflickr.com/300/300?lock=${Math.random()*100}`}
        />
        {[...Array(4).keys()].map((i, index)=>(
          <img
            key={index}
            className="aspect-[11/10] w-full flex-none bg-gray-200 rounded-xl col-span-2 object-cover"
            src={images[i + 1] ||
              `https://loremflickr.com/300/300?lock=${index + 2}`}
          />
        ))}

      </div>
      <img
        className="md:hidden w-full aspect-[4/3] bg-gray-200 rounded-xl flex-none col-span-4 row-span-2 object-cover"
        src={'https://loremflickr.com/300/300?lock=1'}
      />
    </>
  );
}

function ReviewsList({ reviews }: {reviews: any[]}) {
  return (
    <div className="[&>*:not:first-child]:border-b border-neutral-200">
      {reviews.map(review=>(
        <ReviewItem key={review.id} review={review}/>
      ))}
    </div>
  );
}

function ReviewItem({ review }) {
  const rating = parseInt(review.rating);
  const parsedTimestamp = dayjs(review.created_at);
  const timeDifference = dayjs().to(parsedTimestamp);

  return (
    <div className="text-sm space-y-2 text-neutral-600">
      <div className="flex text-yellow-500">
        {[...Array(rating).keys()].map(i=>(
          <IconStar />
        ))}
        {[...Array(5-rating).keys()].map(i=>(
          <IconStar outline />
        ))}
      </div>
      <p className="text-base text-black">{review.body}</p>
      <p className="">{review.user?.email}</p>
      <p className="text-right">{timeDifference}</p>
    </div>
  );
}

function ReviewInputField({ campsite_id }: { campsite_id: string | number }) {
  const [rating, setRating] = useState(0);

  return (
    <ValidatedForm
      validator={validator}
      method="POST"
      className="flex flex-col gap-3"
    >
      <div className="flex text-yellow-500">
        {[...Array(5).keys()].map((i, index)=>(
          <button
            key={i}
            type="button"
            onClick={()=>setRating(index+1)}
            className="cursor-default"
          >
            {index + 1 <= rating ?
              <IconStar /> :
              <IconStar outline />}
          </button>
        ))}
      </div>
      <input
        hidden
        type="hidden"
        name="rating"
        value={rating}
      />
      <FormTextField textarea name="body" />
      <input
        hidden
        type="hidden"
        name="campsite_id"
        value={campsite_id}
      />
      <FormButton
        name="_action"
        value="create_review"
        label="Add review"
      />
    </ValidatedForm>
  );
}

function DescriptionSection({ description, ...props }: { description: string} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <SectionLayout {...props}>
      <p>{description}</p>
    </SectionLayout>
  );
}

function FeaturesSection({ featureList, ...props }: { featureList: string[]} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <SectionLayout {...props}>
      <SectionHeader title="Features you can expect" />

      <div className="grid grid-cols-2 gap-3">
        {featureList.map(feature=><p>{feature}</p>)}
      </div>
    </SectionLayout>
  );
}

function ActivitiesSection({ activityList, ...props }: { activityList: string[]} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <SectionLayout {...props}>
      <SectionHeader title="Activities you can do here" />

      <div className="grid grid-cols-2 gap-3">
        {activityList.map(activity=><p>{activity}</p>)}
      </div>
    </SectionLayout>
  );
}

function AmenitiesSection({ amenityList, ...props }: { amenityList: string[]} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <SectionLayout {...props}>
      <SectionHeader title="What this place offers" />

      <div className="grid grid-cols-2 gap-3">
        {amenityList.map(amenity=><p>{amenity}</p>)}
      </div>
    </SectionLayout>
  );
}

function AccessibilityFeaturesSection({ accessibilityFeatureList, ...props }: { accessibilityFeatureList: string[]} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <SectionLayout {...props}>
      <SectionHeader title="Accessibility" />

      <div className="grid grid-cols-2 gap-3">
        {accessibilityFeatureList.map(accessibilityFeature=><p>{accessibilityFeature}</p>)}
      </div>
    </SectionLayout>
  );
}

function MainSectionLayout({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

function SectionHeader({ title }: { title: string}) {
  return (
    <h3 className="text-xl font-semibold">{title}</h3>
  );
}

function SectionLayout({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div  className={cn('space-y-8 text-sm py-10 border-t border-neutral-100 ', className)} {...props}>
      {children}
    </div>
  );
}
