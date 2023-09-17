import { z } from 'zod';
import { zfd } from 'zod-form-data';

import COUNTRY_LIST from '~/constants/COUNTRY_LIST';

export const addressSchema = z.object({
  addressLine1: zfd
    .text(z
      .string({ required_error: 'Please enter an address.' })
      .min(3, { message: 'Address line be at least 3 characters.' })),
  addressLine2: zfd
    .text(z
      .string()
      .min(3, { message: 'Address line must be at least 3 characters.' })
      .optional()),
  city: zfd
    .text(z
      .string({ required_error: 'Please enter a city.' })
      .min(2, { message: 'City must be at least 3 characters.' })),
  state: zfd
    .text(z
      .string({ required_error: 'Please enter a state.' })
      .min(2, { message: 'State must be at least 3 characters.' })),
  postcode: zfd
    .text(z
      .string({ required_error: 'Please enter a postal code.' })
      .min(5, { message: 'Postal must be 5 characters.' })
      .max(5, { message: 'Postal must be 5 characters.' })),
  country: zfd
    .text(z
      .enum(COUNTRY_LIST, { required_error: 'Please select a country.' })),
});
