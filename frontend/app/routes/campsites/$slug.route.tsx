import { type DataFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { ofetch } from 'ofetch';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';
import { API_BASE_URL } from '~/config.server';
import { Auth } from '~/modules/auth/auth.server';
import { getApiData } from '~/utils/loader';

export const schema = z.object({
  body: zfd
    .text(z
      .string({ required_error: 'Please enter your email.' })
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

  const { _action, body, campsite_id } = result.data;

  if (_action === 'create_review') {

    let error = false;

    const authToken = await Auth.getToken(request);

    const result = await ofetch(
      `${API_BASE_URL}/campsites/${campsite_id}/reviews`, {
        method: 'POST',
        body: { body },
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

        <p>{attributes.description}</p>

        {user && !attributes.reviews_users.includes(parseInt(user?.data?.id)) &&
          <ReviewInputField id={attributes.id} />}

        <ReviewsList reviews={attributes.reviews} />

        {attributes && (
          <div>{JSON.stringify(attributes)}</div>
        )}
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
    <div>
      {reviews.map(review=>(
        <div key={review.id}>
          <p>{JSON.stringify(review)}</p>
        </div>
      ))}
    </div>
  );
}

function ReviewInputField({ id }) {

  return (
    <ValidatedForm validator={validator} method="POST">
      <FormTextField textarea name="body" />
      <input
        hidden
        type="hidden"
        name="campsite_id"
        value={id}
      />
      <FormButton name="_action" value="create_review">Add review</FormButton>
    </ValidatedForm>
  );
}
