import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const schema = z.object({
  rating: zfd
    .numeric(z
      .number({ required_error: 'Rating is required.' })
      .min(1, { message: 'Rating is required' })
      .max(5, { message: 'Max rating is 5' })),
  body: zfd
    .text(z
      .string({ required_error: 'Content is required.' })
      .min(3, { message: 'Body must be more than 3 characters' }))
});

export const validator = withZod(schema);
