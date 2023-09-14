import type { User } from './user';

interface Review {
  user: User;
  body: string;
  images: string[];

  created_at: Date;
  updated_at: Date;
}

export type { Review };
