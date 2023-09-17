import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const schema = z.object({
  authorizedDocument: zfd
    .checkbox()
    .refine((val) =>
      val, 'You must be an authorized document signer to fill this form.'),
  name: zfd
    .text(z
      .string({ required_error: 'Please enter your name.' })
      .min(3, { message: 'Name must be at least 3 characters.' })),
  idNumber: zfd
    .text(z
      .string({ required_error: 'Please enter your identification number.' })),
  phoneNumber: zfd
    .text(z
      .string({ required_error: 'Please enter your mobile number.' })
      .min(7, { message: 'Mobile number should be at least 7 characters.' })
      .max(20,
        { message: 'Mobile number should be less than 20 characters.' })),
  phoneNumberVerified: zfd
    .checkbox()
    .refine((val) => val, 'Phone number not verified.'),
});

export type OrganizationRepresentativeDetailsInput = z.infer<typeof schema>;
