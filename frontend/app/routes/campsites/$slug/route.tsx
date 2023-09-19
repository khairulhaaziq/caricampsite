import { json, type LoaderFunctionArgs } from '@remix-run/node';
import {
  useFetcher,
  useLoaderData,
  useRouteLoaderData
} from '@remix-run/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { useField, ValidatedForm } from 'remix-validated-form';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';
import IconHeart from '~/components/icons/IconHeart';
import IconStar from '~/components/icons/IconStar';
import { API_BASE_URL } from '~/config.server';
import { ClientOnly } from '~/utils/ClientOnly';
import { cn } from '~/utils/cn';

import LeafletMap from './LeafletMap.client';
import { validator } from './schema';

dayjs.extend(relativeTime);

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const queryParams = (new URL(request.url).searchParams).toString();

  const { pathname } = new URL(request.url);

  const result = await fetch(
    `${API_BASE_URL}${pathname}?slug=true&${queryParams}`)
    .then(async (res)=>{
      const json = await res.json();
      return json;
    });

  return json(result);
};

export default function CampsiteSlug() {
  const { user } = useRouteLoaderData('root');
  const { data } = useLoaderData();
  const { attributes } = data;

  return (
    <div className="flex justify-center px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-16">
      <div className="w-full max-w-6xl flex flex-col gap-5">
        {attributes ?
          <>
            <Header
              title={attributes.title}
              visits_users={attributes.visits_users}
              favourites_users={attributes.favourites_users}
              user_id={user?.data?.id}
              campsite_id={data?.id}
            />
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

                <ReviewSection
                  reviews={attributes.reviews}
                  user={user}
                  campsite_id={attributes.id}
                  reviews_users={attributes.reviews_users}
                />

                {attributes && (
                  <div>{JSON.stringify(attributes)}</div>
                )}
              </MainSectionLayout>
              <div className="pr-3 w-[400px] flex-none">
                <div className="border rounded-2xl p-5 flex flex-col gap-4 bg-white shadow-dropshadow/button">
                  <ClientOnly fallback={<div></div>}>
                    {()=><LeafletMap />}
                  </ClientOnly>
                  <div className="flex gap-3 font-semibold flex-col">
                    <button className="bg-[#E8E8E8] rounded-xl px-4 h-12 items-center">Call now</button>
                    <button className="bg-[#E8E8E8] rounded-xl px-4 h-12 items-center">Get directions</button>
                  </div>
                  <AddressSection address={attributes.campsite_address} />
                </div>
              </div>
            </div>
          </> :
          <div>Record not found</div>
        }
      </div>
    </div>
  );
}

function Header({ title, visits_users, favourites_users, user_id, campsite_id }: { title: string; visits_users: number[]; favourites_users: number[]; user_id: string; campsite_id: number }) {
  const fetcher = useFetcher();

  return (
    <div className="flex justify-between pt-8 items-center">
      <div className="text-neutral-500">
        <h1 className="font-bold text-2xl sm:text-3xl capitalize text-black">
          {title}
        </h1>
        <p>Category, Category</p>
        <p>Price, Price</p>
      </div>

      <div>
        <div className="flex gap-2 font-medium">
          <fetcher.Form
            method="POST"
            action={`/api/v1/campsites/${campsite_id}/visits`}
            onSubmit={(e)=>!user_id && e.preventDefault()}
          >
            <button
              name="_action"
              value={visits_users.includes(parseInt(user_id)) ? 'delete' : 'create'}
              className="active:scale-90 transition-all bg-white rounded-xl px-5 h-10 items-center flex gap-2 border border-[#DBDBDB]"
            >
              <span className={`${
                visits_users.includes(parseInt(user_id)) ?
                  'text-rose-600' :
                  'text-rose-300'
              }`}
              ><IconHeart /></span> <span>Visits </span><span className="rounded-full bg-[#E8E8E8] h-5 w-5 flex items-center justify-center text-sm">{visits_users.length}</span>
            </button>
          </fetcher.Form>
          <fetcher.Form
            method="POST"
            action={`/api/v1/campsites/${campsite_id}/favourites`}
            onSubmit={(e)=>!user_id && e.preventDefault()}
          >
            <button
              name="_action"
              value={favourites_users.includes(parseInt(user_id)) ? 'delete' : 'create'}
              className="active:scale-90 transition-all bg-white rounded-xl px-5 h-10 items-center flex gap-2 border border-[#DBDBDB]"
            >
              <span className={`${
                favourites_users.includes(parseInt(user_id)) ?
                  'text-rose-600' :
                  'text-rose-300'
              }`}
              ><IconHeart /></span> <span>Favourite </span><span className="rounded-full bg-[#E8E8E8] h-5 w-5 flex items-center justify-center text-sm">{favourites_users.length}</span>
            </button>
          </fetcher.Form>
          <button className="bg-white rounded-xl px-5 h-10 items-center border border-[#DBDBDB]">Share</button>
        </div>
      </div>
    </div>
  );
}

function ImageGrid({ images, cover_image }: {images: string[]; cover_image?: string }) {
  return (
    <>
      <div className="hidden md:grid md:grid-cols-8 gap-2.5 rounded-2xl overflow-hidden">
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

function ReviewSection({ reviews, campsite_id, user, reviews_users, ...props }: {reviews: any[]} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <SectionLayout {...props}>
      <SectionHeader title="Reviews" />

      <>
        {!user && (<div>Log in to add a review!</div>)}
        {user && !reviews_users.includes(parseInt(user?.data?.id)) &&
        <ReviewInputField campsite_id={campsite_id} />}

        <ReviewsList reviews={reviews} />

        <p>{JSON.stringify(reviews)}</p>
      </>
    </SectionLayout>

  );
}

function ReviewsList({ reviews }: {reviews: any[]}) {
  return (
    <div className="">
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
  const [isEditingReview, setIsEditingReview] = useState(false);
  const { user } = useRouteLoaderData('root');
  const fetcher = useFetcher();

  const isOwner = parseInt(user?.data?.id) === parseInt(review.user?.id);

  if (isEditingReview) {
    return (
      <ReviewInputField
        campsite_id={review.campsite_id}
        action="update_review"
        onSuccess={()=>setIsEditingReview(false)}
        defaultReviewValue={review}
      />
    );
  }

  else {
    return (
      <div className="text-sm flex gap-2 text-neutral-500 py-4 first:pt-0 border-t border-neutral-200 first:border-t-0">
        <div className="space-y-2 flex-grow">
          <div className="flex text-yellow-500">
            {[...Array(rating).keys()].map(i=>(
              <IconStar />
            ))}
            {[...Array(5-rating).keys()].map(i=>(
              <IconStar outline />
            ))}
          </div>
          <p className="text-base text-black whitespace-pre-wrap">{review.body}</p>
          <p className="">{review.user?.email} <span>•</span> {timeDifference}</p>
        </div>
        {isOwner &&
    (<div className="flex gap-2 h-fit">
      <button onClick={()=>setIsEditingReview(!isEditingReview)}>Edit</button>
      <fetcher.Form
        method="POST"
        action={`/api/v1/campsites/${review.campsite_id.toString()}/reviews`}
      >
        <button
          name="_action"
          value="delete_review"
        >Delete</button>
      </fetcher.Form>
    </div>)
        }
      </div>
    );
  }
}

function ReviewInputField({ campsite_id, action='create_review', onSuccess, defaultReviewValue }: { campsite_id: string | number; action?: 'create_review' | 'update_review'; onSuccess?: ()=>void; defaultReviewValue?: any }) {
  const [rating, setRating] = useState(0);
  const fetcher = useFetcher();
  const formId = 'review-form';
  const { error: ratingFieldError, validate: ratingFieldValidate } = useField('rating', { formId });

  useEffect(()=>{
    if (fetcher.data?.success) {
      onSuccess && onSuccess();
    }
  }, [fetcher.data]);

  useEffect(()=>{
    setRating(defaultReviewValue?.rating || 0);
  }, []);

  useEffect(()=>{
    if (rating)
      ratingFieldValidate();
  }, [rating]);

  return (
    <ValidatedForm
      id={formId}
      validator={validator}
      fetcher={fetcher}
      method="POST"
      defaultValues={{
        rating: defaultReviewValue?.rating,
        body: defaultReviewValue?.body
      }}
      action={`/api/v1/campsites/${campsite_id.toString()}/reviews`}
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
              <IconStar size={6}  /> :
              <IconStar size={6} outline />}
          </button>
        ))}
      </div>
      <input
        hidden
        type="hidden"
        name="rating"
        value={rating}
      />
      {ratingFieldError && (
        <p className="text-danger flex gap-1 items-center">
          {ratingFieldError}
        </p>
      )}
      <FormTextField textarea name="body" />
      <FormButton
        name="_action"
        value={action}
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
    <div  className={cn('space-y-8 text-sm py-10 border-t border-neutral-200 ', className)} {...props}>
      {children}
    </div>
  );
}

function AddressSection({ address, ...props }: { address: object} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="" {...props}>
      <div className="flex flex-col gap-2">
        <div className="w-[100px] flex-none text-neutral-400 tracking-widest font-medium text-xs">
          <p>ADDRESS</p>
        </div>
        {address?.addressLine1 &&
        <div className="">
          <p>{address.addressLine1}</p>
          {address?.addressLine2 && <p>{address.addressLine2}</p>}
          <p>{address.city}</p>
          <p>{address.postcode} {address.state}</p>
        </div>
        }
      </div>

    </div>
  );
}
