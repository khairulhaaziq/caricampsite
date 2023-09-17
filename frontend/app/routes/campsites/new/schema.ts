import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const schema = z.object({
  name: zfd
    .text(z
      .string({ required_error: 'Please enter a name.' })
      .min(3, { message: 'Name must be at least 3 characters.' })),
  description: zfd
    .text(z
      .string({ required_error: 'Please enter a description.' })),
  images: zfd
    .text(z
      .array(z
        .string())
    ),
  cover_image: zfd
    .text(z
      .string({ required_error: 'Please select a cover image.' })),
});

export type OrganizationRepresentativeDetailsInput = z.infer<typeof schema>;
