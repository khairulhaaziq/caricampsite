import { useLoaderData } from '@remix-run/react';

import { getApiData } from '~/utils/loader';

export const loader = getApiData();

export default function Index() {
  const { data } = useLoaderData();
  const { attributes } = data;

  return (
    <div className="flex justify-center px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-20 pb-16">
      <div className="w-full max-w-6xl flex flex-col gap-5">
        <Header name={attributes.name} />
        <ImageGrid images={attributes.images} />

        <p>{attributes.description}</p>
        Hello
        {attributes && (
          <div>{JSON.stringify(attributes)}</div>
        )}
      </div>
    </div>
  );
}

function Header({ name }: { name: string }) {
  return (
    <div className="flex justify-between pt-8">
      <div className="text-neutral-500">
        <h1 className="font-bold text-2xl sm:text-3xl capitalize text-black">
          {name}
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
          className="w-full aspect-square bg-gray-200 rounded-xl flex-none col-span-4 row-span-2 object-cover"
          src={cover_image || images[0]?.image_url || `https://loremflickr.com/300/300?lock=${Math.random()*100}`}
        />
        {[...Array(4).keys()].map((i, index)=>(
          <img
            key={index}
            className="aspect-square w-full flex-none bg-gray-200 rounded-xl col-span-2 object-cover"
            src={images[i + 1]?.image_url || `https://loremflickr.com/300/300?lock=${index + 2}`}
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
