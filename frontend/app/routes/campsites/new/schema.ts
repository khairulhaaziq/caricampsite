import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { addressSchema } from '~/utils/schema';

export const schema = z.object({
  title: zfd
    .text(z
      .string({ required_error: 'Please enter a title.' })
      .min(3, { message: 'Title must be at least 3 characters.' })),
  notes: zfd
    .text(z
      .string()
      .min(3, { message: 'Notes must be at least 3 characters.' })).optional(),
  direction_instructions: zfd
    .text(z
      .string()
      .min(3, { message: 'Direction instructions must be at least 3 characters.' })).optional(),
  description: zfd
    .text(z
      .string({ required_error: 'Please enter a description.' })),
  images: zfd.repeatable(z
    .array(z
      .string())
    .min(1, 'Please upload at least one image.')),
  cover_image: zfd
    .text(z
      .string({ required_error: 'Please select a cover image.' })),
  campsite_address_attributes: addressSchema.optional(),
  campsite_fee_attributes: z.object({
    currency: zfd
      .text(z
        .string({ required_error: 'Please enter a currency.' })
        .min(2, { message: 'Currency line be at least 3 characters.' })),
    from: zfd
      .numeric(z
        .number({ required_error: 'Please enter a price from.' })),
    to: zfd
      .numeric(z
        .number({ required_error: 'Please enter a price to.' })),
  })
    .optional(),
  campsite_location_attributes: z.object({
    latitude: zfd
      .numeric(z
        .number({ required_error: 'Please enter a latitude.' }).optional()),
    longitude: zfd
      .numeric(z
        .number({ required_error: 'Please enter a longitude.' }).optional()),
  })
    .optional(),
  feature_option_ids: zfd.repeatable(z
    .array(zfd.numeric())  //TODO: Use enums
    .min(1, 'Please select at least one feature.')),
  amenity_option_ids: zfd.repeatable(z
    .array(zfd.numeric())  //TODO: Use enums
    .min(1, 'Please select at least one amenity.')),
  activity_option_ids: zfd.repeatable(z
    .array(zfd.numeric())  //TODO: Use enums
    .min(1, 'Please select at least one activities.')),
  category_option_ids: zfd.repeatable(z
    .array(zfd.numeric()) //TODO: Use enums
    .min(1, 'Please select at least one categories.')),
  accessibility_feature_option_ids: zfd.repeatable(z
    .array(zfd.numeric())), //TODO: Use enums
  instagram: zfd
    .text(z
      .string()
      .min(3, { message: 'Link must be at least 3 characters.' }).optional())
    .optional(),
  contact_mobile1: zfd
    .text(z
      .string()
      .min(3, { message: 'No. must be at least 3 characters.' }).optional())
    .optional(),
});
