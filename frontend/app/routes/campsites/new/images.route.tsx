import { type DataFunctionArgs, json } from '@remix-run/node';

export const action = async ({ request }: DataFunctionArgs)=> {
  const { method } = request;

  if (method !== 'POST') {
    return json(
      { error: { message: 'Method Not Allowed' } },
      { status: 405 });
  }

  const form = await request.formData();

  let result;

  await fetch(process.env.S3_API_ENDPOINT!,
    {
      method: 'POST',
      headers: {
        S3_UPLOAD_USERNAME: process.env.S3_UPLOAD_USERNAME!,
        S3_UPLOAD_PASSWORD: process.env.S3_UPLOAD_PASSWORD!,
      },
      mode: 'cors',
      credentials: 'include',
      body: form,
    })
    .then(async (res) => {
      const json = await res.json();
      console.log(json);
      result = { ...json, success: true };
    })
    .catch((err) =>{
      console.error(err);
      result = { ...err, error: true };
    });

  return json({ result });
};
