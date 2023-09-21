import type { LoaderFunctionArgs } from '@remix-run/node';
import {
  Link,
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
import IconLocation from '~/components/icons/IconLocation';
import IconStar from '~/components/icons/IconStar';
import { Campsite } from '~/modules/campsite/campsite.server';
import { ClientOnly } from '~/utils/ClientOnly';
import { cn } from '~/utils/cn';

import LeafletMap from './LeafletMap.client';
import { validator } from './schema';

dayjs.extend(relativeTime);

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return await Campsite.getCampsitePageData(request, { slug: params.slug! });
};

export default function CampsiteSlug() {
  const { user } = useRouteLoaderData('root');
  const { data } = useLoaderData();
  const { attributes } = data;

  useEffect(()=>{
    if (attributes)
      console.log('slugdata: ', attributes);
  }, [attributes]);

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
              admins={attributes.admins}
              campsite_id={data?.id}
              address={attributes.campsite_address}
            />
            <ImageGrid images={attributes.images} />

            <div className="flex gap-20 py-8">
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

              </MainSectionLayout>
              <div className="w-[420px] flex-none">
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

function Header({ title, visits_users, favourites_users, user_id, campsite_id, admins, address }: { title: string; visits_users: number[]; favourites_users: number[]; user_id: string; campsite_id: number; admins: any[]; address: any }) {
  const visitCampsiteFetcher = useFetcher();
  const favouriteCampsiteFetcher = useFetcher();
  const deleteCampsiteFetcher = useFetcher();
  const isOwner = admins.map(i=>i.id).includes(parseInt(user_id));

  return (
    <div className="flex justify-between pt-7 items-center text-sm pb-2">
      <div className="text-neutral-500 space-y-2">
        <h1 className="font-semibold text-2xl sm:text-[26px] leading-8 capitalize text-black">
          {title}
        </h1>
        <p>{[address?.city, address?.state, address?.country].join(', ')}</p>
      </div>

      <div>
        <div className="flex gap-2 font-medium">
          <visitCampsiteFetcher.Form
            method="POST"
            action={`/api/v1/campsites/${campsite_id}/visits`}
            onSubmit={(e)=>!user_id && e.preventDefault()}
          >
            <button
              name="_action"
              value={visits_users.includes(parseInt(user_id)) ? 'delete' : 'create'}
              className="active:scale-90 transition-all bg-white rounded-xl px-4 h-10 items-center flex gap-1.5 border border-[#DBDBDB]"
            >
              <span className={`${
                visits_users.includes(parseInt(user_id)) ?
                  'text-black' :
                  'text-black/50'
              } h-5 w-5`}
              ><IconLocation /></span><span className="h-5 w-5 flex items-center justify-center text-sm">{visits_users.length}</span>
            </button>
          </visitCampsiteFetcher.Form>
          <favouriteCampsiteFetcher.Form
            method="POST"
            action={`/api/v1/campsites/${campsite_id}/favourites`}
            onSubmit={(e)=>!user_id && e.preventDefault()}
          >
            <button
              name="_action"
              value={favourites_users.includes(parseInt(user_id)) ? 'delete' : 'create'}
              className="active:scale-90 transition-all bg-white rounded-xl px-4 h-10 items-center flex gap-1.5 border border-[#DBDBDB]"
            >
              <span className={`${
                favourites_users.includes(parseInt(user_id)) ?
                  'text-rose-600' :
                  'text-rose-300'
              } h-5 w-5`}
              ><IconHeart /></span><span className="h-5 w-5 flex items-center justify-center text-sm">{favourites_users.length}</span>
            </button>
          </favouriteCampsiteFetcher.Form>
          <button className="active:scale-90 transition-all bg-white rounded-xl px-5 h-10 items-center border border-[#DBDBDB]">Share</button>

          {isOwner &&
          <>
            <Link to="./edit" className="active:scale-90 transition-all bg-white rounded-xl px-5 h-10 flex items-center border border-[#DBDBDB]">Edit</Link>
            <deleteCampsiteFetcher.Form
              method="POST"
              action={`/api/v1/campsites/${campsite_id}`}
              onSubmit={(e)=>!user_id && e.preventDefault()}
            >
              <button
                name="_action"
                value="delete"
                className="active:scale-90 transition-all bg-white rounded-xl px-5 h-10 flex items-center border border-[#DBDBDB]"
              >Delete</button>
            </deleteCampsiteFetcher.Form>
          </>
          }
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
  useEffect(()=>{
    if (reviews)
      console.log('reviews: ', reviews);
  }, [reviews]);

  return (
    <SectionLayout {...props}>
      <SectionHeader title="Reviews" />

      <>
        {!user && (<div>Log in to add a review!</div>)}
        {user && !reviews_users.includes(parseInt(user?.data?.id)) &&
        <ReviewInputField campsite_id={campsite_id} />}

        <ReviewsList reviews={reviews} />
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
        action="update"
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
              <span className="h-5 w-5" key={i}>
                <IconStar />
              </span>
            ))}
            {[...Array(5-rating).keys()].map(i=>(
              <span className="h-5 w-5" key={i}>
                <IconStar outline />
              </span>
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
          value="delete"
        >Delete</button>
      </fetcher.Form>
    </div>)
        }
      </div>
    );
  }
}

function ReviewInputField({ campsite_id, action='create', onSuccess, defaultReviewValue }: { campsite_id: string | number; action?: 'create' | 'update'; onSuccess?: ()=>void; defaultReviewValue?: any }) {
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
            className="cursor-default h-8 w-8"
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
      <p className="whitespace-pre-wrap">{description}</p>
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
    <h3 className="text-lg font-medium">{title}</h3>
  );
}

function SectionLayout({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div  className={cn('space-y-6 text-[15px] leading-relaxed py-10 border-t border-neutral-200 ', className)} {...props}>
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
